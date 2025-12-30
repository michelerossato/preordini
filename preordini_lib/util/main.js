var graphicManager, dataManager, qrcodeManager;

function avviaApplicazione() {
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    function costruisciMenu() {
        var hashmap = dataManager.getInstanceHashmap();
        $("#lista").empty().html(graphicManager.generateMenu(hashmap)).trigger("create");
        graphicManager.setButtonPlusMinus(hashmap);
        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    costruisciMenu();
    $(document).on("pageshow", "#pageprinc", costruisciMenu);
}

$(document).on("click", "#resoconto-btn", function (evt) {
    evt.preventDefault();
    var hashmap = dataManager.getInstanceHashmap();
    if (hashmap.size() === 0) {
        alert("L'ordine è vuoto!");
        return;
    }
    dataManager.saveInstanceCoperti($("#coperti").val());
    graphicManager.popolaResoconto();
    $.mobile.pageContainer.pagecontainer("change", "#pageres");
});

$(document).on("click", "#conferma-btn", function (evt) {
    evt.preventDefault();
    if (!$("#nomecliente").val() || !$("#tavolo").val() || !$("#coperti").val()) {
        alert("Compila tutti i campi prima di confermare!");
        return;
    }
    graphicManager.popolaQRCode();
    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode");
});

$(document).on("click", "#elimina-ordine-btn, #nuovo-ordine-btn", function (evt) {
    evt.preventDefault();
    if (confirm("Vuoi annullare l'ordine?")) {
        $.removeCookie("hashmap");
        $.removeCookie("coperti");
        location.reload();
    }
});
