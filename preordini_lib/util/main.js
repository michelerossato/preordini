$(document).ready(function () {
    // Inizializzazione dati e grafica
    var hashmap = dataManager.getInstanceHashmap();
    
    // Genera il menu nella pagina principale
    $("#lista").html(graphicManager.generateMenu(hashmap)).collapsibleset("refresh");
    graphicManager.setButtonPlusMinus(hashmap);

    // Gestione tasto "Vedi resoconto"
    $("#resoconto-btn").on("click", function () {
        if (hashmap.keys().length > 0) {
            graphicManager.popolaResoconto();
            $(":mobile-pagecontainer").pagecontainer("change", "#pageres");
        } else {
            // Se l'ordine è vuoto mostra un avviso
            alert("L'ordine è vuoto! Seleziona almeno un prodotto.");
        }
    });

    // Gestione tasto "Modifica Ordine" (Torna indietro)
    $("#modifica-btn").on("click", function () {
        $(":mobile-pagecontainer").pagecontainer("change", "#pageprinc");
    });

    // Gestione tasto "Conferma Ordine" (Genera QR)
    $("#conferma-btn").on("click", function () {
        var nome = $("#nomecliente").val();
        var tavolo = $("#tavolo").val();

        if (!nome || !tavolo) {
            alert("Per favore inserisci Nome e Numero Tavolo prima di confermare.");
        } else {
            graphicManager.popolaQRCode();
            $(":mobile-pagecontainer").pagecontainer("change", "#pageqrcode");
        }
    });

    // Gestione tasto "Elimina ordine"
    $("#elimina-ordine-btn").on("click", function () {
        if (confirm("Vuoi davvero eliminare l'intero ordine?")) {
            dataManager.eliminaOrdine();
        }
    });

    // Gestione tasto "Nuovo Ordine" (Dalla pagina QR)
    $("#nuovo-ordine-btn").on("click", function () {
        dataManager.eliminaOrdine();
    });
});
