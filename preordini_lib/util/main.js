$(document).on("datiPronti", function () {
    console.log("Inizializzazione Menu e Pulsanti...");
    var hashmap = dataManager.getInstanceHashmap();
    
    // Genera l'HTML del menu
    $("#lista").html(graphicManager.generateMenu(hashmap)).collapsibleset("refresh");
    
    // Inizializza i pulsanti + e -
    graphicManager.setButtonPlusMinus(hashmap);

    // Gestione pulsanti di navigazione
    $("#resoconto-btn").on("click", function () {
        if (hashmap.keys().length > 0) {
            graphicManager.popolaResoconto();
            $(":mobile-pagecontainer").pagecontainer("change", "#pageres");
        } else {
            alert("L'ordine è vuoto! Seleziona qualcosa dal menù.");
        }
    });

    $("#conferma-btn").on("click", function () {
        var n = $("#nomecliente").val();
        var t = $("#tavolo").val();
        var c = $("#coperti").val();

        if (n && t && c) {
            graphicManager.popolaQRCode();
            $(":mobile-pagecontainer").pagecontainer("change", "#pageqrcode");
        } else {
            alert("Per favore, inserisci Nome, Tavolo e numero di Persone.");
        }
    });

    $("#elimina-ordine-btn, #nuovo-ordine-btn").on("click", function () {
        if(confirm("Sei sicuro di voler eliminare l'ordine?")) {
            dataManager.eliminaOrdine();
        }
    });
});
