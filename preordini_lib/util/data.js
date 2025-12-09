// VARIABILI GLOBALI PER IL MENU
<<<<<<< HEAD
// Verranno popolate dalla chiamata AJAX a menu.json (ora CSV da Google Sheet)

=======
// Verranno popolate dalla chiamata AJAX a Google Sheets
>>>>>>> 7aaeb4900171caccc14d9e737c3564735e9fcfb5
var elencoPrincipale = []; // Contiene i nomi delle categorie (es. "Antipasti")
var categorie = [];       // Contiene gli oggetti categoria completi
var elencoPietanze = {};  // Mappa gli articoli per nome categoria 

<<<<<<< HEAD
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
            
            const rawArticoli = results.data.filter(row => row.id && row.CAT); // Filtra righe senza ID o CAT
            const categorieMap = {}; 
            
            // La colonna per il raggruppamento è "CAT"
            rawArticoli.forEach(articolo => {
                
                // *** MODIFICA EFFETTUATA QUI: USIAMO articolo.CAT ***
                const categoriaNome = articolo.CAT; 
                
                if (categoriaNome) { 
                    if (!categorieMap[categoriaNome]) {
                        categorieMap[categoriaNome] = {
                            descrizione: categoriaNome,
                            articoli: []
                        };
                    }
                    
                    // Converte i valori importanti (id, prezzo, ecc.) in numeri
                    articolo.id = parseInt(articolo.id, 10);
                    articolo.prezzo = parseFloat(articolo.prezzo || 0); 
                    
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
=======
// -------------------------------------------------------------------------
// *** INSERISCI QUI IL TUO URL CSV PUBBLICATO DA GOOGLE SHEETS ***
// -------------------------------------------------------------------------
var GOOGLE_SHEET_URL = './menu.csv'
// -------------------------------------------------------------------------


function popolaMenuDaSheets(sheetUrl) {
    // Reset delle variabili prima del caricamento
    elencoPrincipale = [];
    categorie = [];
    elencoPietanze = {};
    
    // Funzione per ripulire e convertire i prezzi
    function sanitizePrice(value) {
        // Sostituisce la virgola con il punto se l'utente usa il formato italiano
        return parseFloat(value.replace(',', '.').trim());
    }

    $.ajax({
      url: sheetUrl, 
      async: false,
      dataType: "text", // Ci aspettiamo un file di testo (CSV)
      success: function(csvData) {
          
          // --- Logica Personalizzata per Analizzare il CSV ---
          
          // Separa il file in righe e rimuove la prima riga (intestazione)
          var lines = csvData.trim().split('\n');
          // La prima riga è l'intestazione, la saltiamo
          if (lines.length > 0) lines.shift(); 
          
          // Analizza ogni riga
          for (var i = 0; i < lines.length; i++) {
              var line = lines[i].trim();
              if (line.length === 0) continue;
              
              // Separa la riga in colonne, assumendo il punto e virgola (;) o la virgola (,) come separatore
              var columns = line.split(/[,;]/); 
              
              // Se la riga non ha almeno 3 colonne, la ignora
              if (columns.length < 3) continue;

              var categoriaNome = columns[0].trim();
              var nomeArticolo = columns[1].trim();
              var prezzoArticolo = sanitizePrice(columns[2]);

              if (categoriaNome && nomeArticolo && !isNaN(prezzoArticolo)) {
                  
                  // 1. Raggruppa gli articoli per categoria (costruisce la struttura)
                  if (!elencoPietanze[categoriaNome]) {
                      elencoPietanze[categoriaNome] = [];
                      elencoPrincipale.push(categoriaNome); 
                      categorie.push({ descrizione: categoriaNome, articoli: [] }); 
                  }
                  
                  // 2. Aggiunge l'articolo
                  elencoPietanze[categoriaNome].push({
                      nome: nomeArticolo,
                      prezzo: prezzoArticolo
                  });
              }
          }
          // --- Fine Analisi CSV ---

          console.log("Dati del menu caricati con successo da Google Sheets!");
          
          // CHIAMATA ALLA FUNZIONE DI AVVIO:
          if (typeof avviaApplicazione === 'function') {
              avviaApplicazione();
          }
          
      },
      error: function(xhr, status, error) {
          console.error("FATAL ERROR: Impossibile caricare il menu da Google Sheets. Controlla il link. Stato:", status, "Errore:", error);
      }
    });
}

// Avvia il caricamento dei dati
popolaMenuDaSheets(GOOGLE_SHEET_URL); 

// ----------------------------------------------------
// CLASSE DATA E FUNZIONI DI GESTIONE COOKIE/STORAGE (RIMANGONO INVARIATE)
>>>>>>> 7aaeb4900171caccc14d9e737c3564735e9fcfb5
// ----------------------------------------------------

function Data(){
    
    var riferimentoHashMap = "_hashmap";
    var riferimentoCoperti = "_coperti";
    
    function recreateHashmap(value){
        var hashmap = new HashMap();
        for(var i = 0; i < value.length; i++){
            hashmap.put(value[i].key, value[i].val);
        }
        return hashmap;
    }
    
    this.getInstanceHashmap = function(){
        var hashmap = $.cookie(riferimentoHashMap);
        if(typeof hashmap !== 'undefined' && hashmap !== null){
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
        if(typeof coperti !== 'undefined' && coperti !== null){
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