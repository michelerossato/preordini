// VARIABILI GLOBALI (necessarie per l'uso in più funzioni)
var graphicManager;
var dataManager;
var qrcodeManager; // Aggiunto se usato nel tuo sistema

// --------------------------------------------------------------------------
// FUNZIONE CHIAMATA DOPO IL CARICAMENTO DEI DATI (DEFINITA IN data.js)
// --------------------------------------------------------------------------
function avviaApplicazione() {
    console.log("Applicazione avviata. Costruisco il menu...");
    
    // 1. Inizializza i manager DOPO che i dati globali (elencoPietanze) sono stati popolati in data.js
    graphicManager = new GraphicManager();
    dataManager = new Data();
    qrcodeManager = new QRCodeManager();

    // 2. Costruisce la struttura del menu (Collapsible Set)
    costruisciMenu();

    // 3. Aggiunge i gestori di eventi
    // (Non chiamiamo gestisciEventi() qui, ma affidiamo a jQuery Mobile la logica.)
    // Il tuo codice originale in main.js usa 'pagebeforeshow' per costruire il menu.
    
    // 4. Se hai una logica che richiede un avvio, mettila qui. 
    // Altrimenti, jQuery Mobile prende il controllo.
    
    // Se c'è un ordine in corso, navigazione alla pagina resoconto:
    var hashmap = dataManager.getInstanceHashmap();
    if(hashmap.size() > 0){
        $.mobile.pageContainer.pagecontainer("change", "#pageres", {});
    }
}


function costruisciMenu() {
    var listaDiv = $('#lista');
    listaDiv.empty(); // Pulisce la lista esistente

    // Itera su tutte le categorie caricate da data.js (elencoPrincipale e elencoPietanze sono globali)
    for (var i = 0; i < elencoPrincipale.length; i++) {
        var categoriaNome = elencoPrincipale[i];
        var articoli = elencoPietanze[categoriaNome];

        if (articoli && articoli.length > 0) {
            
            // Crea il contenitore della categoria (collapsible)
            var collapsible = $('<div>')
                .attr('data-role', 'collapsible')
                .append($('<h2>').text(categoriaNome));
            
            var ul = $('<ul>').attr('data-role', 'listview').attr('data-inset', 'true');

            // Aggiunge gli articoli alla lista
            for (var j = 0; j < articoli.length; j++) {
                var articolo = articoli[j];
                var prezzoFormattato = parseFloat(articolo.prezzo).toFixed(2).replace('.', ',') + ' €';
                
                // Creazione dell'elemento della lista
                var li = $('<li>')
                    .append($('<a>')
                        .attr('href', '#popup-ordine')
                        .attr('data-rel', 'popup')
                        .attr('data-position-to', 'window')
                        .attr('data-transition', 'pop')
                        .data('articolo', articolo) // Memorizza l'oggetto articolo
                        .append($('<h2>').text(articolo.nome))
                        .append($('<p>').text(prezzoFormattato))
                    );
                ul.append(li);
            }
            collapsible.append(ul);
            listaDiv.append(collapsible);
        }
    }
    
    // Forzare jQuery Mobile a inizializzare i componenti appena creati
    listaDiv.collapsibleset('refresh').trigger('create');
    listaDiv.find('ul').listview('refresh');
}

// --------------------------------------------------------------------------
// GESTIONE EVENTI JQUERY MOBILE (MANTENUTA LA LOGICA ORIGINALE)
// --------------------------------------------------------------------------

$(document).on("pagebeforeshow", "#pageprinc", function() {
    // La logica di costruzione del menu viene chiamata qui se i dati sono già stati caricati.
    // E' meglio chiamare costruisciMenu() solo una volta in avviaApplicazione().
    // Se è necessario ricaricare, è meglio usare un metodo di aggiornamento.
    
    // Se usi la logica di graphicManager.generateMenu nel tuo file graphicManager.js,
    // dovrai adattare la logica qui. Dato che non ho il tuo graphicManager.js,
    // ho incluso qui sopra una funzione costruisciMenu() semplice per testare il caricamento.
    
    // Rimuovi questo blocco se la tua logica è solo in avviaApplicazione.
});

// Aggiungi qui gli handler per i click dei link degli articoli
$(document).on('click', '#lista li a', function(e) {
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
$(document).on("click", "#resoconto-btn", function() {
    // La logica per mostrare il riepilogo va qui (e nel graphicManager)
    console.log("Vedi resoconto cliccato.");
    $.mobile.pageContainer.pagecontainer("change", "#pageres", {});
});

// Gestore per il bottone Modifica Ordine
$(document).on("click", "#modifica-btn", function() {
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
});

// Gestore per il bottone Conferma Ordine
$(document).on("click", "#conferma-btn", function() {
    // Qui andrebbe la logica per generare il QR code
    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode", {});
});

// Gestore per il bottone Elimina ordine
$(document).on("click", "#elimina-ordine-btn", function() {
    if(confirm("Sei sicuro di voler eliminare l'ordine attuale?")) {
        dataManager.saveInstanceHashmap(new HashMap());
        alert("Ordine eliminato con successo!");
        $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
        costruisciMenu(); // Ricarica il menu dopo l'eliminazione
    }
});

// Gestore per il bottone Nuovo Ordine
$(document).on("click", "#nuovo-ordine-btn", function() {
    if(confirm("Sei sicuro di voler iniziare un nuovo ordine? L'ordine precedente verrà eliminato.")) {
        dataManager.saveInstanceHashmap(new HashMap());
        $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
        costruisciMenu(); // Ricarica il menu dopo l'eliminazione
    }
});