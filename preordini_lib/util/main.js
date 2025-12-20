// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;


// ======================================================================
// CHIAMATA DOPO CARICAMENTO JSONP (data.js)
// ======================================================================
function avviaApplicazione() {

    console.log("✅ avviaApplicazione: menu pronto");

    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    // =============================================================
    // COSTRUZIONE MENU (UNA SOLA FUNZIONE)
    // =============================================================
    function costruisciMenu() {

        const hashmap = dataManager.getInstanceHashmap();

        $("#lista")
            .empty()
            .html(graphicManager.generateMenu(hashmap))
            .trigger("create");

        graphicManager.setButtonPlusMinus(hashmap);

        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    // prima costruzione
    costruisciMenu();

    // ricostruzione quando torni alla pagina
    $(document).on("pageshow", "#pageprinc", costruisciMenu);

    // se c’è già un ordine → vai al resoconto
    if (!dataManager.getInstanceHashmap().isEmpty()) {
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    }
}


// ======================================================================
// VEDI RESOCONTO
// ======================================================================
$(document).on("click", "#resoconto-btn", function (e) {
    e.preventDefault();

    const hashmap = dataManager.getInstanceHashmap();

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


// ======================================================================
// MODIFICA ORDINE
// ======================================================================
$(document).on("click", "#modifica-btn", function (e) {
    e.preventDefault();
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});


// ======================================================================
// ELIMINA ORDINE
// ======================================================================
$(document).on("click", "#elimina-ordine-btn", function (e) {
    e.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare l'ordine?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});


// ======================================================================
// CONFERMA → QR
// ======================================================================
$(document).on("click", "#conferma-btn", function (e) {
    e.preventDefault();

    graphicManager.popolaQRCode();
    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode");
});


// ======================================================================
// NUOVO ORDINE
// ======================================================================
$(document).on("click", "#nuovo-ordine-btn", function (e) {
    e.preventDefault();

    if (!confirm("Vuoi iniziare un nuovo ordine?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});
