var graphicManager;
var dataManager;
var qrcodeManager;

function avviaApplicazione() {

    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    function costruisciMenu() {
        const hashmap = dataManager.getInstanceHashmap();

        $("#lista")
            .empty()
            .html(graphicManager.generateMenu(hashmap))
            .trigger("create");

        graphicManager.setButtonPlusMinus(hashmap);
        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    $(document).on("pageshow", "#pageprinc", costruisciMenu);
    costruisciMenu();
}


// -------------------
// RESOCONTO
// -------------------
$(document).on("click", "#resoconto-btn", function (e) {
    e.preventDefault();

    const hashmap = dataManager.getInstanceHashmap();

    // ✅ CONTROLLO GIUSTO
    if (hashmap.size() === 0) {
        $("#popup-ordine").popup("open");
        return;
    }

    dataManager.saveInstanceHashmap(hashmap);
    dataManager.saveInstanceCoperti($("#coperti").val());

    graphicManager.popolaResoconto();
    $.mobile.pageContainer.pagecontainer("change", "#pageres");
});
