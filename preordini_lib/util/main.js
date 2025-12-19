// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;


// ======================================================================
// FUNZIONE CHIAMATA DOPO IL CARICAMENTO DEL MENU (data.js)
// ======================================================================
function avviaApplicazione() {

    console.log("Applicazione avviata. Inizializzo i manager...");

    // Inizializza i manager UNA SOLA VOLTA
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    // =============================================================
    // PAGINA PRINCIPALE – GENERAZIONE MENU
    // =============================================================
    $(document).on("pagebeforeshow", "#pageprinc", function () {

        var hashmap = dataManager.getInstanceHashmap();

        // 1. Genera menu dinamico
        $("#lista").empty().html(
            graphicManager.generateMenu(hashmap)
        );

        // 2. 🔥 FONDAMENTALE: riattiva jQuery Mobile
        $("#lista").trigger("create");

        // 3. Attiva i pulsanti + / -
        graphicManager.setButtonPlusMinus(hashmap);

        // 4. Coperti
        $("#coperti").val(dataManager.getInstanceCoperti());
    });

    // =============================================================
    // SE ESISTE GIÀ UN ORDINE → VAI AL RESOCONTO
    // =============================================================
    if (dataManager.getInstanceHashmap().size() > 0) {
        $.mobile.pageContainer
            .pagecontainer("change", "#pageres");
    }
}


// ======================================================================
// EVENTI BOTTONI
// ======================================================================
$(document).on("click", "#resoconto-btn", function (evt) {
    evt.preventDefault();

    var hashmap = dataManager.getInstanceHashmap();

    if (hashmap.isEmpty()) {
        graphicManager.generatePopup("#popup-ordine", { value: false });
        $("#popup-ordine").popup("open");
    } else {
        dataManager.saveInstanceHashmap(hashmap);
        dataManager.saveInstanceCoperti($("#coperti").val());

        graphicManager.popolaResoconto();
        $.mobile.pageContainer
            .pagecontainer("change", "#pageres");
    }
});


$(document).on("click", "#elimina-ordine-btn", function (evt) {
    evt.preventDefault();

    if (confirm("Sei sicuro di voler eliminare l'ordine attuale?")) {
        dataManager.saveInstanceHashmap(new HashMap());
        alert("Ordine eliminato!");
        $.mobile.pageContainer
            .pagecontainer("change", "#pageprinc");
    }
});


$(document).on("click", "#modifica-btn", function (evt) {
    evt.preventDefault();
    $.mobile.pageContainer
        .pagecontainer("change", "#pageprinc");
});


$(document).on("click", "#conferma-btn", function (evt) {
    evt.preventDefault();
    graphicManager.popolaQRCode();
    $.mobile.pageContainer
        .pagecontainer("change", "#pageqrcode");
});


$(document).on("click", "#nuovo-ordine-btn", function (evt) {
    evt.preventDefault();

    if (confirm("Vuoi davvero iniziare un nuovo ordine?")) {
        dataManager.saveInstanceHashmap(new HashMap());
        $.mobile.pageContainer
            .pagecontainer("change", "#pageprinc");
    }
});
