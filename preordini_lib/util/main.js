// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;


// ======================================================================
// AVVIO APPLICAZIONE (chiamata da data.js)
// ======================================================================
function avviaApplicazione() {

    console.log("Applicazione avviata. Inizializzo i manager...");

    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    function costruisciMenu() {

        var hashmap = dataManager.getInstanceHashmap();

        $("#lista")
            .empty()
            .html(graphicManager.generateMenu(hashmap))
            .trigger("create");

        graphicManager.setButtonPlusMinus(hashmap);

        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    costruisciMenu();
    $(document).on("pageshow", "#pageprinc", costruisciMenu);
}


// ======================================================================
// EVENTI BOTTONI
// ======================================================================

// ---------------------
// VEDI RESOCONTO
// ---------------------
$(document).on("click", "#resoconto-btn", function (evt) {
    evt.preventDefault();

    var hashmap = dataManager.getInstanceHashmap();

    // ✅ CONTROLLO CORRETTO
    if (hashmap.size() === 0) {
        graphicManager.generatePopup();
        $("#popup-ordine").popup("open");
        return;
    }

    dataManager.saveInstanceHashmap(hashmap);
    dataManager.saveInstanceCoperti($("#coperti").val());

    graphicManager.popolaResoconto();

    $.mobile.pageContainer.pagecontainer("change", "#pageres");
});


// ---------------------
// ELIMINA ORDINE
// ---------------------
$(document).on("click", "#elimina-ordine-btn", function (evt) {
    evt.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare l'ordine attuale?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});


// ---------------------
// MODIFICA ORDINE
// ---------------------
$(document).on("click", "#modifica-btn", function (evt) {
    evt.preventDefault();
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});


// ---------------------
// CONFERMA ORDINE
// ---------------------
$(document).on("click", "#conferma-btn", function (evt) {
    evt.preventDefault();

    graphicManager.popolaQRCode();
    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode");
});


// ---------------------
// NUOVO ORDINE
// ---------------------
$(document).on("click", "#nuovo-ordine-btn", function (evt) {
    evt.preventDefault();

    if (!confirm("Vuoi davvero iniziare un nuovo ordine?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});
