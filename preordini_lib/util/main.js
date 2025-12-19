var graphicManager;
var dataManager;
var qrcodeManager;

function avviaApplicazione() {

    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    function costruisciMenu() {
        const hashmap = dataManager.getInstanceHashmap();
        $("#lista").empty().html(graphicManager.generateMenu(hashmap));
        $("#lista").trigger("create");
        graphicManager.setButtonPlusMinus(hashmap);
        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    costruisciMenu();
    $(document).on("pageshow", "#pageprinc", costruisciMenu);
}


// ================== BOTTONI ==================

$(document).on("click", "#resoconto-btn", function (e) {
    e.preventDefault();

    const ordine = dataManager.getInstanceHashmap().toObject();

    if (Object.keys(ordine).length === 0) {
        graphicManager.generatePopup();
        $("#popup-ordine").popup("open");
        return;
    }

    dataManager.saveInstanceCoperti($("#coperti").val());
    graphicManager.popolaResoconto();
    $.mobile.pageContainer.pagecontainer("change", "#pageres");
});

$(document).on("click", "#elimina-ordine-btn", function () {
    if (!confirm("Eliminare l'ordine?")) return;
    dataManager.saveInstanceHashmap(new HashMap());
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});

$(document).on("click", "#modifica-btn", function () {
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});

$(document).on("click", "#conferma-btn", function () {
    graphicManager.popolaQRCode();
    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode");
});

$(document).on("click", "#nuovo-ordine-btn", function () {
    if (!confirm("Nuovo ordine?")) return;
    dataManager.saveInstanceHashmap(new HashMap());
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});
