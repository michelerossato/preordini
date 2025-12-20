// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;


// ======================================================================
// AVVIO APPLICAZIONE
// ======================================================================
$(document).on("mobileinit", function () {
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
});

$(document).on("pagecreate", "#pageprinc", function () {

    console.log("Applicazione avviata");

    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    costruisciMenu();
});


// ======================================================================
// COSTRUZIONE MENU
// ======================================================================
function costruisciMenu() {

    const hashmap = dataManager.getInstanceHashmap();

    $("#lista")
        .empty()
        .html(graphicManager.generateMenu(hashmap))
        .trigger("create");

    graphicManager.setButtonPlusMinus(hashmap);

    $("#coperti").val(dataManager.getInstanceCoperti());
}


// ======================================================================
// VEDI RESOCONTO
// ======================================================================
$(document).on("click", "#resoconto-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const hashmap = dataManager.getInstanceHashmap();

    if (hashmap.isEmpty()) {
        graphicManager.generatePopup();
        $("#popup-ordine").popup("open");
        return;
    }

    dataManager.saveInstanceHashmap(hashmap);
    dataManager.saveInstanceCoperti($("#coperti").val());

    graphicManager.popolaResoconto();

    $.mobile.changePage("#pageres", {
        transition: "slide"
    });
});


// ======================================================================
// MODIFICA ORDINE
// ======================================================================
$(document).on("click", "#modifica-btn", function (e) {
    e.preventDefault();
    $.mobile.changePage("#pageprinc", { transition: "slide", reverse: true });
});


// ======================================================================
// CONFERMA → QR CODE
// ======================================================================
$(document).on("click", "#conferma-btn", function (e) {
    e.preventDefault();
    graphicManager.popolaQRCode();
    $.mobile.changePage("#pageqrcode", { transition: "slide" });
});


// ======================================================================
// ELIMINA ORDINE
// ======================================================================
$(document).on("click", "#elimina-ordine-btn", function (e) {
    e.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare l'ordine?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.changePage("#pageprinc", { transition: "fade" });
});


// ======================================================================
// NUOVO ORDINE
// ======================================================================
$(document).on("click", "#nuovo-ordine-btn", function (e) {
    e.preventDefault();

    if (!confirm("Vuoi iniziare un nuovo ordine?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");

    $.mobile.changePage("#pageprinc", { transition: "fade" });
});
