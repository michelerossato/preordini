// VARIABILI GLOBALI
var graphicManager;
var dataManager;
var qrcodeManager;

// --------------------------------------------------------------------------
// FUNZIONE CHIAMATA DOPO IL CARICAMENTO DEI DATI (DEFINITA IN data.js)
// --------------------------------------------------------------------------
function avviaApplicazione() {
    console.log("Applicazione avviata. Inizializzo i manager...");
    
    // Inizializza i manager DOPO che i dati globali (elencoPietanze) sono stati popolati in data.js
    // Questi manager devono essere inizializzati UNA SOLA VOLTA.
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();
    
    // Controlla se esiste un ordine in corso
    var hashmap = dataManager.getInstanceHashmap();
    if(hashmap.size() > 0){
        // Se c'è un ordine, mostra subito il resoconto
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    }
    
    // Non è necessario chiamare la costruzione del menu qui, ci pensa l'handler 'pagebeforeshow'
    // quando la pagina principale viene caricata.
}

// --------------------------------------------------------------------------
// GESTIONE EVENTI JQUERY MOBILE (LOGICA DI COSTRUZIONE MENU)
// --------------------------------------------------------------------------

// Questo handler viene eseguito OGNI volta che si naviga alla pagina principale (#pageprinc)
$(document).on("pagebeforeshow", "#pageprinc", function() {
    
    // Assicurarsi che i manager siano stati istanziati da avviaApplicazione()
    if (!graphicManager || !dataManager) {
        // Se non sono stati inizializzati, l'app è in uno stato non valido.
        console.error("ERRORE: I manager non sono stati inizializzati. Riprovare a caricare la pagina.");
        return; 
    }
    
    var hashmap = dataManager.getInstanceHashmap();
    
    // 1. Costruisce il menu chiamando generateMenu
    $("#lista").empty().append(
        graphicManager.generateMenu(
            hashmap
        )
    ).collapsibleset();
    
    // 2. Forza jQuery Mobile a renderizzare correttamente la lista e i collapsible
    $("#lista").collapsibleset('refresh').trigger("create"); 
    
    // 3. Aggiunge gli handler per i bottoni +/-
    graphicManager.setButtonPlusMinus(hashmap);
    
    // 4. Popola i campi cliente/tavolo/coperti
    // Nota: Ho rimosso le chiamate a getInstanceNome/Tavolo perché non le vedo nel tuo data.js,
    // se non funzionano, dovrai aggiungerle al data.js.
    // $("#nomecliente").val(dataManager.getInstanceNome());
    // $("#tavolo").val(dataManager.getInstanceTavolo());
    $("#coperti").val(dataManager.getInstanceCoperti());
});


// --------------------------------------------------------------------------
// GESTIONE EVENTI BOTTONI (SENZA MODIFICHE SOSTANZIALI)
// --------------------------------------------------------------------------

// Rimosso l'handler "pageshow" che conteneva l'errore a riga 72

$(document).on("click", "#resoconto-btn", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    
    var hashmap = dataManager.getInstanceHashmap();
    
    if(hashmap.isEmpty()){
        graphicManager.generatePopup(
            "#popup-ordine",
            {value: false}
        );
        $("#popup-ordine").popup("open");
    }
    else{
        // Salva i dati prima di passare al resoconto
        dataManager.saveInstanceHashmap(hashmap);
        // dataManager.saveInstanceNome($("#nomecliente").val()); // Rimosso se non esiste in data.js
        // dataManager.saveInstanceTavolo($("#tavolo").val()); // Rimosso se non esiste in data.js
        dataManager.saveInstanceCoperti($("#coperti").val());
        
        graphicManager.popolaResoconto(); 
        
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    }
});

$(document).on("click", "#elimina-ordine-btn", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    if(confirm("Sei sicuro di voler eliminare l'ordine attuale?")) {
        dataManager.saveInstanceHashmap(new HashMap());
        // dataManager.saveInstanceNome(""); // Rimosso se non esiste in data.js
        // dataManager.saveInstanceTavolo(""); // Rimosso se non esiste in data.js
        alert("Ordine eliminato con successo!");
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
    graphicManager.popolaQRCode(); 
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