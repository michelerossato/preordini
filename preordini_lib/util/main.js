var dataManager;
var graphicManager;
var qrcodeManager;

// Questa funzione viene chiamata da data.js DOPO che i dati del menu sono stati caricati.
function avviaApplicazione(){
    // I manager vengono istanziati solo DOPO che data.js ha terminato l'elaborazione (via PapaParse).
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    // QUI C'ERA LA CHIAMATA A graphicManager.inizializza(); - ORA RIMOSSA.

    // Controlla se esiste un ordine in corso
    var hashmap = dataManager.getInstanceHashmap();
    if(hashmap.size() > 0){
        // Se c'è un ordine, mostra subito il resoconto
        $.mobile.changePage("#pageres");
    }
}

// Quando il pulsante "Vedi resoconto" viene cliccato
$(document).on("click", "#resoconto-btn", function() {
    graphicManager.popolaResoconto(); // Assumiamo che questo metodo esista
    $.mobile.changePage("#pageres");
});

// Quando il pulsante "Elimina ordine" viene cliccato
$(document).on("click", "#elimina-ordine-btn", function() {
    if(confirm("Sei sicuro di voler eliminare l'ordine attuale?")) {
        dataManager.saveInstanceHashmap(new HashMap());
        alert("Ordine eliminato con successo!");
        // Ricarica la pagina principale per riflettere lo stato vuoto
        $.mobile.changePage("#pageprinc");
        // QUI C'ERA UNA CHIAMATA A graphicManager.inizializza(); - ORA RIMOSSA.
    }
});

// Quando il pulsante "Modifica Ordine" viene cliccato
$(document).on("click", "#modifica-btn", function() {
    $.mobile.changePage("#pageprinc");
});

// Quando il pulsante "Conferma Ordine" viene cliccato
$(document).on("click", "#conferma-btn", function() {
    graphicManager.popolaQRCode(); // Assumiamo che questo metodo esista
    $.mobile.changePage("#pageqrcode");
});

// Quando il pulsante "Nuovo Ordine" viene cliccato (dopo aver visualizzato il QR code)
$(document).on("click", "#nuovo-ordine-btn", function() {
    if(confirm("Sei sicuro di voler iniziare un nuovo ordine? L'ordine precedente verrà eliminato.")) {
        dataManager.saveInstanceHashmap(new HashMap());
        $.mobile.changePage("#pageprinc");
        // QUI C'ERA UNA CHIAMATA A graphicManager.inizializza(); - ORA RIMOSSA.
    }
});

// Gestione dell'incremento/decremento quantità (all'interno del popup)
$(document).on("click", "#add-btn", function() {
    var nomePietanza = $("#title-popup").text();
    graphicManager.incrementaQuantita(nomePietanza); // Assumiamo che questo metodo esista
});

$(document).on("click", "#remove-btn", function() {
    var nomePietanza = $("#title-popup").text();
    graphicManager.decrementaQuantita(nomePietanza); // Assumiamo che questo metodo esista
});

// Ricarica la lista per assicurare che gli stati dei pulsanti siano aggiornati
// Questo blocco probabilmente gestiva il refresh del menu, che nel tuo codice originale
// avviene tramite l'evento 'pagebeforeshow' o logica interna al GraphicManager.
$(document).on("pageshow", "#pageprinc", function() {
    // QUI C'ERA LA CHIAMATA A graphicManager.inizializza(); - ORA RIMOSSA.
    // L'UI dovrebbe aggiornarsi tramite la logica interna del GraphicManager in risposta agli eventi.
});