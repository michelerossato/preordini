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

    // Inizializzazione manager (UNA SOLA VOLTA)
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    // =============================================================
    // FUNZIONE UNICA DI COSTRUZIONE MENU
    // =============================================================
    function costruisciMenu() {

        var hashmap = dataManager.getInstanceHashmap();

        // Genera menu dinamico
        $("#lista")
            .empty()
            .html(graphicManager.generateMenu(hashmap));

        // Riattiva jQuery Mobile
        $("#lista").trigger("create");

        // Attiva bottoni + / -
        graphicManager.setButtonPlusMinus(hashmap);

        // Ripristina coperti
        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    // ✅ COSTRUZIONE IMMEDIATA (prima visualizzazione)
    costruisciMenu();

    // 🔁 Ricostruzione quando si ritorna alla pagina principale
    $(document).on("pageshow", "#pageprinc", costruisciMenu);

    // =============================================================
    // SE ESISTE GIÀ UN ORDINE → VAI AL RESOCONTO
    // =============================================================
    if (dataManager.getInstanceHashmap().size() > 0) {
        $.mobile.pageContainer.pagecontainer("change", "#pageres");
    }
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

    if (hashmap.isEmpty()) {
        graphicManager.generatePopup("#popup-ordine", { value: false });
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
// CONFERMA ORDINE → QR
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

