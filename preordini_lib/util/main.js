$(document).on("datiPronti", function () {
    console.log("Inizializzo l'applicazione...");
    
    var hashmap = dataManager.getInstanceHashmap();
    
    // Costruisce il menu
    $("#lista").html(graphicManager.generateMenu(hashmap)).collapsibleset("refresh");
    
    // Attiva i pulsanti + e -
    graphicManager.setButtonPlusMinus(hashmap);

    // Gestione navigazione Resoconto
    $("#resoconto-btn").on("click", function () {
        if (hashmap.keys().length > 0) {
            graphicManager.popolaResoconto();
            $(":mobile-pagecontainer").pagecontainer("change", "#pageres");
        } else {
            alert("Scegli almeno un piatto prima di continuare!");
        }
    });

    // Gestione navigazione QR Code
    $("#conferma-btn").on("click", function () {
        var n = $("#nomecliente").val();
        var t = $("#tavolo").val();
        var c = $("#coperti").val();

        if (n && t && c) {
            graphicManager.popolaQRCode();
            $(":mobile-pagecontainer").pagecontainer("change", "#pageqrcode");
        } else {
            alert("Compila tutti i campi: Nome, Tavolo e Quanti siete!");
        }
    });

    // Reset ordine
    $("#elimina-ordine-btn, #nuovo-ordine-btn").on("click", function () {
        if(confirm("Vuoi annullare l'ordine corrente?")) {
            dataManager.eliminaOrdine();
        }
    });
});
