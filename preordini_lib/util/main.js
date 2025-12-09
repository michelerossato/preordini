var dataManager;
var graphicManager;
var qrcodeManager;

// Questa funzione viene chiamata da data.js DOPO che i dati del menu sono stati caricati.
function avviaApplicazione(){
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    // Inizializza l'interfaccia utente
    graphicManager.inizializza();

    // Controlla se esiste un ordine in corso
    var hashmap = dataManager.getInstanceHashmap();
    if(hashmap.size() > 0){
        // Se c'è un ordine, mostra subito il resoconto
        $.mobile.changePage("#pageres");
    }
}

// Quando il pulsante "Vedi resoconto" viene cliccato
$(document).on("click", "#resoconto-btn", function() {
    graphicManager.popolaResoconto();
    $.mobile.changePage("#pageres");
});

// Quando il pulsante "Elimina ordine" viene cliccato
$(document).on("click", "#elimina-ordine-btn", function() {
    if(confirm("Sei sicuro di voler eliminare l'ordine attuale?")) {
        dataManager.saveInstanceHashmap(new HashMap());
        alert("Ordine eliminato con successo!");
        // Ricarica la pagina principale per riflettere lo stato vuoto
        $.mobile.changePage("#pageprinc");
        graphicManager.inizializza(); // Ricarica la lista per assicurarsi che sia aggiornata
    }
});

// Quando il pulsante "Modifica Ordine" viene cliccato
$(document).on("click", "#modifica-btn", function() {
    $.mobile.changePage("#pageprinc");
});

// Quando il pulsante "Conferma Ordine" viene cliccato
$(document).on("click", "#conferma-btn", function() {
    graphicManager.popolaQRCode();
    $.mobile.changePage("#pageqrcode");
});

// Quando il pulsante "Nuovo Ordine" viene cliccato (dopo aver visualizzato il QR code)
$(document).on("click", "#nuovo-ordine-btn", function() {
    if(confirm("Sei sicuro di voler iniziare un nuovo ordine? L'ordine precedente verrà eliminato.")) {
        dataManager.saveInstanceHashmap(new HashMap());
        $.mobile.changePage("#pageprinc");
        graphicManager.inizializza(); // Ricarica la lista
    }
});

// Gestione dell'incremento/decremento quantità (all'interno del popup)
$(document).on("click", "#add-btn", function() {
    var nomePietanza = $("#title-popup").text();
    graphicManager.incrementaQuantita(nomePietanza);
});

$(document).on("click", "#remove-btn", function() {
    var nomePietanza = $("#title-popup").text();
    graphicManager.decrementaQuantita(nomePietanza);
});

// Ricarica la lista per assicurare che gli stati dei pulsanti siano aggiornati
$(document).on("pageshow", "#pageprinc", function() {
    graphicManager.inizializza();
});