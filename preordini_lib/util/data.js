// VARIABILI GLOBALI PER IL MENU
// Verranno popolate dalla chiamata AJAX a menu.json (ora CSV da Google Sheet)

var elencoPrincipale = []; // Contiene i nomi delle categorie (es. "Antipasti")
var categorie = [];       // Contiene gli oggetti categoria completi
var elencoPietanze = {};  // Mappa gli articoli per nome categoria 

// ----------------------------------------------------
// NUOVA FUNZIONE PER IL CARICAMENTO DEI DATI DA GOOGLE SHEET CSV
// ----------------------------------------------------

function popolaMenuDaCSV() {
    
    // URL della tua Google Sheet pubblicata in formato CSV
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRIyRtTRCMqUH_qI4knGCE-llpqNvfKXW9xEFpa6R4unSNXqlt0zbEThuvy6ugnGTgZl_BNX067D9uy/pub?output=csv';

    // PapaParse recupera e analizza il CSV
    Papa.parse(CSV_URL, {
        download: true, // Permette a PapaParse di scaricare l'URL
        header: true,   // Tratta la prima riga del CSV come nomi delle colonne
        complete: function(results) {
            
            // -------------------------------------------------------------------
            // PARSING E RISTRUTTURAZIONE DEI DATI RICEVUTI
            // -------------------------------------------------------------------
            
            // Filtra righe senza ID o CAT (nome della colonna della categoria)
            const rawArticoli = results.data.filter(row => row.id && row.CAT); 
            const categorieMap = {}; 
            
            // Cicla tutti gli articoli ricevuti
            rawArticoli.forEach(articolo => {
                
                // USIAMO articolo.CAT (come da analisi del tuo file CSV)
                const categoriaNome = articolo.CAT; 
                
                if (categoriaNome) { 
                    if (!categorieMap[categoriaNome]) {
                        categorieMap[categoriaNome] = {
                            descrizione: categoriaNome,
                            articoli: []
                        };
                    }
                    
                    // Converte i valori importanti (id, prezzo, ecc.) in numeri
                    // Nota: Assicurati che le colonne ID, CAT, e prezzo esistano nel tuo foglio Google.
                    articolo.id = parseInt(articolo.id, 10);
                    // Rimuove eventuali valute o separatori di migliaia prima di convertire in float
                    articolo.prezzo = parseFloat(String(articolo.prezzo).replace(',', '.') || 0); 
                    
                    categorieMap[categoriaNome].articoli.push(articolo);
                }
            });
            
            // Estrai l'array finale delle categorie dalla mappa
            const data = {
                categorie: Object.values(categorieMap)
            };
            
            // -------------------------------------------------------------------
            // Logica di Popolamento (originale)
            // -------------------------------------------------------------------

            if (data && data.categorie) {
                categorie = data.categorie;
                
                for (var i = 0; i < categorie.length; i++){
                    var categoriaNome = categorie[i].descrizione;
                    
                    // Popola elencoPrincipale
                    elencoPrincipale.push(categoriaNome);

                    // Popola elencoPietanze con gli articoli
                    elencoPietanze[categoriaNome] = categorie[i].articoli || [];
                }
                console.log("Dati del menu caricati con successo dalla Google Sheet!");
                
                // CHIAMATA ALLA FUNZIONE DI AVVIO:
                if (typeof avviaApplicazione === 'function') {
                    avviaApplicazione();
                }
                
            } else {
                console.error("Struttura dati ricevuta dalla Google Sheet non valida o vuota.");
            }
        },
        error: function(error, file) {
            console.error("FATAL ERROR: Impossibile caricare il menu dalla Google Sheet. Errore:", error);
        }
    });
}

// Chiamata di avvio per popolare il menu all'inizio
popolaMenuDaCSV(); 

// ----------------------------------------------------
// CLASSE DATA E FUNZIONI DI GESTIONE COOKIE/STORAGE (Nessuna modifica)
// ----------------------------------------------------

function Data(){
    
    var riferimentoHashMap = "_hashmap";
    var riferimentoCoperti = "_coperti";
    
    // Funzione interna per ricreare la hashmap
    function recreateHashmap(value){
        var hashmap = new HashMap();
        for(var i = 0; i < value.length; i++){
            hashmap.put(value[i].key, value[i].val);
        }
        return hashmap;
    }
    
    this.getInstanceHashmap = function(){
        var hashmap = $.cookie(riferimentoHashMap);
        if(typeof hashmap !== 'undefined' && hashmap !== null){ // esiste
            return recreateHashmap(JSON.parse(hashmap).value);
        }else{
            hashmap = new HashMap();
            this.saveInstanceHashmap(hashmap);
            return hashmap;
        }
    }
    
    this.saveInstanceHashmap = function(hashmap){
        $.cookie(
            riferimentoHashMap,
            JSON.stringify(hashmap)
        );
    }
    
    this.getInstanceCoperti = function(){
        var coperti = $.cookie(riferimentoCoperti);
        if(typeof coperti !== 'undefined' && coperti !== null){ // esiste
            return parseInt(coperti);
        }else{
            return 1;
        }
    }
    
    this.saveInstanceCoperti = function(coperti){
        $.cookie(
            riferimentoCoperti,
            coperti
        );
    }
}