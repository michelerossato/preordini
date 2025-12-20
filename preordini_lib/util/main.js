// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;
var appAvviata = false;


// ======================================================================
// AVVIO APPLICAZIONE (UNA SOLA VOLTA)
// ======================================================================
function avviaApplicazione() {

    if (appAvviata) return;
    appAvviata = true;

    console.log("Applicazione avviata");

    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();
}


// ======================================================================
// PAGINA PRINCIPALE – OGNI VOLTA CHE SI MOSTRA
// ======================================================================
$(document).on("pageshow", "#pageprinc", function () {

    avviaApplicazione();

    console.log("Pageshow pageprinc");

    const hashmap = dataManager.getInstanceHashmap();

    // Costruisci menu
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
