// VARIABILI GLOBALI
var graphicManager;
var dataManager;
var qrcodeManager;

// Questa funzione viene chiamata da data.js DOPO che i dati del menu sono stati caricati.
function avviaApplicazione() {
    console.log("Applicazione avviata. Inizializzo i manager...");
    
    // Inizializza i manager DOPO che i dati globali (elencoPietanze) sono stati popolati in data.js
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();
    
    // Controlla se esiste un ordine in corso
    var hashmap = dataManager.getInstanceHashmap();
    if(hashmap.size() > 0){
        // Se c'è un ordine, mostra subito il resoconto
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    }
    
    // La logica di costruzione del menu avviene nell'handler 'pagebeforeshow' qui sotto.
}

// --------------------------------------------------------------------------
// GESTIONE EVENTI JQUERY MOBILE (LOGICA DI COSTRUZIONE MENU)
// --------------------------------------------------------------------------

// Questo handler viene eseguito ogni volta che si naviga alla pagina principale (#pageprinc)
$(document).on("pagebeforeshow", "#pageprinc", function() {
    
    // Assicurarsi che i manager siano stati istanziati prima di usarli
    if (!graphicManager || !dataManager) {
        // Se non sono stati istanziati (dovrebbe avvenire solo una volta in avviaApplicazione)
        // Riprova l'inizializzazione se necessario, o ricarica.
        // Se avviaApplicazione() è fallita, qui ci sarebbe un problema.
        console.warn("I manager non sono stati inizializzati. Riprovare.");
        return; 
    }
    
    var hashmap = dataManager.getInstanceHashmap();
    
    // Chiamata al metodo generateMenu del graphicManager (come trovato nel tuo snippet)
    $("#lista").empty().append(
        graphicManager.generateMenu(
            hashmap
        )
    ).collapsibleset();
    
    // Forza jQuery Mobile a renderizzare correttamente la lista e i collapsible
    $("#lista").collapsibleset('refresh').trigger("create"); 
    
    // Chiamata al metodo per aggiungere la gestione dei click sui pulsanti +/- (come trovato nel tuo snippet)
    graphicManager.setButtonPlusMinus(hashmap);
    
    // Assicurati che i campi cliente/tavolo/coperti siano popolati dai cookie se esistono
    $("#nomecliente").val(dataManager.getInstanceNome());
    $("#tavolo").val(dataManager.getInstanceTavolo());
    $("#coperti").val(dataManager.getInstanceCoperti());
});


// --------------------------------------------------------------------------
// GESTIONE EVENTI BOTTONI (MANTENUTA LA LOGICA ORIGINALE)
// --------------------------------------------------------------------------

$(document).on("click", "#resoconto-btn", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    
    var hashmap = dataManager.getInstanceHashmap();
    
    if(hashmap.isEmpty()){
        // Mostra il popup di errore se l'ordine è vuoto
        graphicManager.generatePopup(
            "#popup-ordine",
            {value: false}
        );
        $("#popup-ordine").popup("open");
    }
    else{
        // Salva i dati prima di passare al resoconto
        dataManager.saveInstanceHashmap(hashmap);
        dataManager.saveInstanceNome($("#nomecliente").val());
        dataManager.saveInstanceTavolo($("#tavolo").val());
        dataManager.saveInstanceCoperti($("#coperti").val());
        
        // Costruisce la pagina di riepilogo
        graphicManager.popolaResoconto(); // Assumiamo esista e popoli #resoconto
        
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    }
});

$(document).on("click", "#elimina-ordine-btn", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    if(confirm("Sei sicuro di voler eliminare l'ordine attuale?")) {
        dataManager.saveInstanceHashmap(new HashMap());
        dataManager.saveInstanceNome("");
        dataManager.saveInstanceTavolo("");
        alert("Ordine eliminato con successo!");
        // Ritorna alla pagina principale e l'handler 'pagebeforeshow' aggiornerà il menu
        $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
    }
});

$(document).on("click", "#modifica-btn", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});

$(document).on("click", "#conferma-btn", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    graphicManager.popolaQRCode(); // Assumiamo esista e popoli la pagina QR code
    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode");
});

$(document).on("click", "#nuovo-ordine-btn", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    if(confirm("Sei sicuro di voler iniziare un nuovo ordine? L'ordine precedente verrà eliminato.")) {
        dataManager.saveInstanceHashmap(new HashMap());
        $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
    }
});