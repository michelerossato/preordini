// VARIABILI GLOBALI PER IL MENU
// Verranno popolate dalla chiamata AJAX a menu.json

var elencoPrincipale = []; // Contiene i nomi delle categorie (es. "Antipasti")
var categorie = [];       // Contiene gli oggetti categoria completi
var elencoPietanze = {};  // Mappa gli articoli per nome categoria 

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

                  // Popola elencoPietanze con gli articoli
                  elencoPietanze[categoriaNome] = categorie[i].articoli || [];
              }
              console.log("Dati del menu caricati con successo da menu.json!");
              
              // CHIAMATA ALLA FUNZIONE DI AVVIO:
              // Avvia l'applicazione (la costruzione della lista) DOPO che i dati sono pronti.
              if (typeof avviaApplicazione === 'function') {
                  avviaApplicazione();
              }
              
          } else {
              console.error("Struttura di menu.json non valida o vuota.");
          }
      },
      error: function(xhr, status, error) {
          console.error("FATAL ERROR: Impossibile caricare il menu. Controlla che menu.json esista e sia valido. Stato:", status, "Errore:", error);
      }
    });
}

// Chiamata di avvio per popolare il menu all'inizio
popolaMenuDaJSON(); 

// ----------------------------------------------------
// CLASSE DATA E FUNZIONI DI GESTIONE COOKIE/STORAGE
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