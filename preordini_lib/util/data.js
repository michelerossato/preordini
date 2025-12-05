// VARIABILI GLOBALI PER IL MENU
// Verranno popolate dalla chiamata AJAX a menu.json

var elencoPrincipale = []; // Contiene i nomi delle categorie (es. "Antipasti")
var categorie = [];       // Contiene gli oggetti categoria completi
var elencoPietanze = {};  // Mappa gli articoli per nome categoria (la struttura usata dal resto del codice)

// ----------------------------------------------------
// FUNZIONE PER IL CARICAMENTO DEI DATI DA FILE JSON
// ----------------------------------------------------

function popolaMenuDaJSON() {
    // Carica il file menu.json che deve trovarsi nella root del repository
    $.ajax({
      url: "menu.json",
      async: false,
      dataType: "json",
      success: function(data) {
          
          // Assumiamo che la struttura JSON sia: { "categorie": [...] }
          if (data && data.categorie) {
              categorie = data.categorie;
              
              for (var i = 0; i < categorie.length; i++){
                  var categoriaNome = categorie[i].descrizione;
                  
                  // Popola elencoPrincipale
                  elencoPrincipale.push(categoriaNome);

                  // Popola elencoPietanze con gli articoli (assumendo che gli articoli siano sotto 'articoli' nel JSON)
                  elencoPietanze[categoriaNome] = categorie[i].articoli || [];
              }
              console.log("Dati del menu caricati con successo da menu.json!");
          } else {
              console.error("Struttura di menu.json non valida o vuota.");
          }
      },
      error: function(xhr, status, error) {
          // Questo errore si verifica se menu.json non esiste o c'è un errore di sintassi JSON.
          console.error("FATAL ERROR: Impossibile caricare il menu. Controlla che menu.json esista e sia valido. Stato:", status, "Errore:", error);
      }
    });
}

// Chiamata di avvio per popolare il menu all'inizio
popolaMenuDaJSON(); 

// ----------------------------------------------------
// VECCHIE FUNZIONI DI POPOLAMENTO (Lasciate come stub per compatibilità
// o rimosse, dato che i dati sono già caricati da popolaMenuDaJSON)
// Le abbiamo rimosse perché non servono più e confondono.
// ----------------------------------------------------

// ----------------------------------------------------
// CLASSE DATA E FUNZIONI DI GESTIONE COOKIE/STORAGE
// (Lasciate invariate perché gestiscono lo stato locale - hashmap e coperti)
// ----------------------------------------------------

function Data(){
    
    var riferimentoHashMap = "_hashmap";
    var riferimentoCoperti = "_coperti";
    var rootURL = "/rest/"; // Variabile non più usata, ma lasciata per compatibilità se il resto del codice la richiede
    
    // Funzione interna per ricreare la hashmap
    function recreateHashmap(value){
        var hashmap = new HashMap(); // Assumiamo che HashMap sia definita altrove (probabilmente in hashmap.js)
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
    
    // Non più usato:
    // var rootURL = "/rest/"; 
}