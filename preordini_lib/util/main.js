// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager = null;
var dataManager = null;
var qrcodeManager = null;


// ======================================================================
// PAGE CREATE – UNA SOLA VOLTA
// ======================================================================
$(document).on("pagecreate", "#pageprinc", function () {

    console.log("✔ pagecreate pageprinc");

    if (!dataManager) {
        dataManager = new Data();
        graphicManager = new GraphicManager();
        qrcodeManager = new QRCodeManager();
    }
});


// ======================================================================
// PAGE SHOW – OGNI VOLTA CHE LA PAGINA È VISIBILE
// ======================================================================
$(document).on("pageshow", "#pageprinc", function () {

    console.log("✔ pageshow pageprinc");

    if (!dataManager || !graphicManager) {
        console.error("Manager non inizializzati");
        return;
    }

    const hashmap = dataManager.getInstanceHashmap();

    // Costruzione menu
    $("#lista")
        .empty()
        .html(graphicManager.generateMenu(hashmap))
        .trigger("create");

    // Attiva + e -
    graphicManager.setButtonPlusMinus(hashmap);

    // Ripristina coperti
    $("#coperti").val(dataManager.getInstanceCoperti());
});


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
// TORNA A MODIFICA ORDINE
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
// CONFERMA → QR CODE
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
