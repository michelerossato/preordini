// VARIABILI GLOBALI (DA ALTRI FILES)
// Le variabili elencoPrincipale e elencoPietanze sono popolate da data.js
// La classe GraphicManager è definita in graphicManager.js (presumibilmente)
var graphicManager = new GraphicManager();
var dataManager = new Data();
var ordineCorrente = dataManager.getInstanceHashmap();

// --------------------------------------------------------------------------
// FUNZIONE CHIAMATA DOPO IL CARICAMENTO DEI DATI (DEFINITA IN data.js)
// --------------------------------------------------------------------------
function avviaApplicazione() {
    console.log("Applicazione avviata. Costruisco il menu...");

    // 1. Costruisce la struttura del menu (Collapsible Set)
    costruisciMenu();

    // 2. Aggiunge i gestori di eventi
    gestisciEventi();
    
    // 3. Aggiorna la pagina jQuery Mobile per visualizzare correttamente i collapsible
    $(':mobile-pagecontainer').pagecontainer('change', '#pageprinc');
    $('#pageprinc').trigger('create');
}

function costruisciMenu() {
    var listaDiv = $('#lista');
    listaDiv.empty(); // Pulisce la lista esistente

    // Itera su tutte le categorie caricate da data.js
    for (var i = 0; i < elencoPrincipale.length; i++) {
        var categoriaNome = elencoPrincipale[i];
        var articoli = elencoPietanze[categoriaNome];

        if (articoli && articoli.length > 0) {
            // Crea il collapsible per la categoria
            var collapsible = $('<div data-role="collapsible"></div>');
            var categoriaTitle = $('<h3>' + categoriaNome + '</h3>');
            
            // Crea la lista degli articoli all'interno del collapsible
            var articoliList = $('<ul data-role="listview" data-inset="false"></ul>');
            
            // Itera su tutti gli articoli di quella categoria
            for (var j = 0; j < articoli.length; j++) {
                var articolo = articoli[j];
                
                // Crea l'elemento della lista per l'articolo
                var listItem = $('<li></li>');
                
                // Formatta il prezzo per visualizzazione (es. 5.00€)
                var prezzoFormattato = parseFloat(articolo.prezzo).toFixed(2).replace('.', ',');
                
                // Aggiunge il link/bottone per selezionare l'articolo
                var itemLink = $('<a>' + 
                                    '<h3>' + articolo.nome + '</h3>' + 
                                    '<p><strong>' + prezzoFormattato + ' €</strong></p>' +
                                  '</a>');
                                  
                // Assegna i dati dell'articolo all'elemento per usarli negli handler (vedi gestisciEventi)
                itemLink.data('articolo', articolo);
                
                listItem.append(itemLink);
                articoliList.append(listItem);
            }
            
            collapsible.append(categoriaTitle);
            collapsible.append(articoliList);
            listaDiv.append(collapsible);
        }
    }
    
    // Aggiorna la struttura jQuery Mobile
    listaDiv.collapsibleset('refresh');
    listaDiv.find('ul[data-role=listview]').listview('refresh');
}


function gestisciEventi() {
    
    // Gestore per i click sugli articoli del menu
    // NOTA: 'on' è usato per gestire eventi su elementi aggiunti dinamicamente
    $('#lista').on('click', 'li a', function(e) {
        e.preventDefault();
        
        var articoloSelezionato = $(this).data('articolo');
        
        // Simula l'apertura del popup ordine (la logica di gestione quantità va nel GraphicManager)
        $('#title-popup').text(articoloSelezionato.nome);
        $('#info-ordine-popup').html(
            '<p>Prezzo: <strong>' + parseFloat(articoloSelezionato.prezzo).toFixed(2).replace('.', ',') + ' €</strong></p>' +
            '<p>Qui andrebbe il selettore di quantità (es. - 1 +) e i bottoni Aggiungi/Annulla.</p>'
        );
        
        $('#popup-ordine').popup('open');
    });

    // Gestore per il bottone Vedi resoconto
    $('#resoconto-btn').on('click', function() {
        // La logica per mostrare il riepilogo va qui (e nel graphicManager)
        console.log("Vedi resoconto cliccato.");
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    });
    
    // Gestore per il bottone Modifica Ordine (per tornare al menu)
    $('#modifica-btn').on('click', function() {
        $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
    });
}


// NOTA: Qui dovrebbe esserci la logica per la gestione del GraphicManager e delle altre pagine, 
// ma ai fini della visualizzazione del menu, queste funzioni sono sufficienti.

// L'esecuzione inizia automaticamente dal data.js chiamando popolaMenuDaSheets(GOOGLE_SHEET_URL);
// che a sua volta chiama avviaApplicazione() in caso di successo.