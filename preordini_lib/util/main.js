c// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;


// ======================================================================
// PAGECREATE – una sola volta
// ======================================================================
$(document).on("pagecreate", "#pageprinc", function () {

    console.log("pagecreate pageprinc");

    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();
});


// ======================================================================
// PAGESHOW – ogni volta che la pagina appare
// ======================================================================
$(document).on("pageshow", "#pageprinc", function () {

    console.log("pageshow pageprinc");

    const hashmap = dataManager.getInstanceHashmap();

    // 🔥 COSTRUZIONE MENU
    const html = graphicManager.generateMenu(hashmap);

    $("#lista").empty().html(html);

    // 🔥 jQuery Mobile refresh
    $("#pageprinc").trigger("create");

    // 🔥 Attiva + e −
    graphicManager.setButtonPlusMinus(hashmap);

    // Coperti
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
// TORNA A MODIFICA
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
