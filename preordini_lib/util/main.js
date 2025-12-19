// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;


// ======================================================================
// AVVIO APPLICAZIONE (chiamata da data.js quando il menu è caricato)
// ======================================================================
function avviaApplicazione() {

    console.log("Applicazione avviata. Inizializzo i manager...");

    dataManager    = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager  = new QRCodeManager();

    // --------------------------------------------------------------
    // COSTRUZIONE MENU (riutilizzabile)
    // --------------------------------------------------------------
    function costruisciMenu() {

        const hashmap = dataManager.getInstanceHashmap();

        $("#lista")
            .empty()
            .html(graphicManager.generateMenu(hashmap))
            .trigger("create");

        graphicManager.setButtonPlusMinus(hashmap);

        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    // Prima visualizzazione
    costruisciMenu();

    // Ricostruzione quando si torna alla pagina principale
    $(document).on("pageshow", "#pageprinc", costruisciMenu);

    // Se esiste già un ordine → vai al resoconto
    if (!dataManager.getInstanceHashmap().isEmpty()) {
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    }
}


// ======================================================================
// EVENTI BOTTONI
// ======================================================================

// ----------------------------------------------------------------------
// VEDI RESOCONTO
// ----------------------------------------------------------------------
$(document).on("click", "#resoconto-btn", function (evt) {
    evt.preventDefault();

    const hashmap = dataManager.getInstanceHashmap();

    console.log("HASHMAP AL RESOCONTO:", hashmap.toObject());

    if (hashmap.isEmpty()) {
        graphicManager.generatePopup();
        $("#popup-ordine").popup("open");
        return;
    }

    dataManager.saveInstanceHashmap(hashmap);
    dataManager.saveInstanceCoperti($("#coperti").val());

    graphicManager.popolaResoconto();

    $.mobile.pageContainer.pagecontainer("change", "#pageres");
});


// ----------------------------------------------------------------------
// ELIMINA ORDINE
// ----------------------------------------------------------------------
$(document).on("click", "#elimina-ordine-btn", function (evt) {
    evt.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare l'ordine attuale?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});


// ----------------------------------------------------------------------
// MODIFICA ORDINE
// ----------------------------------------------------------------------
$(document).on("click", "#modifica-btn", function (evt) {
    evt.preventDefault();
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});


// ----------------------------------------------------------------------
// CONFERMA ORDINE → QR CODE
// ----------------------------------------------------------------------
$(document).on("click", "#conferma-btn", function (evt) {
    evt.preventDefault();

    graphicManager.popolaQRCode();

    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode");
});


// ----------------------------------------------------------------------
// NUOVO ORDINE
// ----------------------------------------------------------------------
$(document).on("click", "#nuovo-ordine-btn", function (evt) {
    evt.preventDefault();

    if (!confirm("Vuoi davvero iniziare un nuovo ordine?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});
