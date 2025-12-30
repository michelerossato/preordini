// ======================================================================
// MANAGER GLOBALI
// ======================================================================
var graphicManager;
var dataManager;
var qrcodeManager;

// ======================================================================
// AVVIO APPLICAZIONE (chiamata da data.js al termine del caricamento API)
// ======================================================================
function avviaApplicazione() {

    console.log("Applicazione avviata. Inizializzo i manager...");

    // Inizializzazione degli oggetti
    dataManager = new Data();
    graphicManager = new GraphicManager();
    qrcodeManager = new QRCodeManager();

    // Funzione per costruire/aggiornare il menu nella pagina principale
    function costruisciMenu() {
        var hashmap = dataManager.getInstanceHashmap();

        $("#lista")
            .empty()
            .html(graphicManager.generateMenu(hashmap))
            .trigger("create"); // Necessario per applicare lo stile jQuery Mobile

        // Attiva i listener sui pulsanti + e -
        graphicManager.setButtonPlusMinus(hashmap);

        // Ripristina il valore dei coperti se salvato nei cookie
        $("#coperti").val(dataManager.getInstanceCoperti());
    }

    // Primo avvio
    costruisciMenu();

    // Refresh del menu ogni volta che si torna alla pagina principale
    $(document).on("pageshow", "#pageprinc", costruisciMenu);
}

// ======================================================================
// EVENTI BOTTONI (Globali)
// ======================================================================

// --- VEDI RESOCONTO ---
$(document).on("click", "#resoconto-btn", function (evt) {
    evt.preventDefault();

    var hashmap = dataManager.getInstanceHashmap();

    // Verifica se l'ordine è vuoto
    if (hashmap.size() === 0) {
        alert("L'ordine è vuoto! Seleziona almeno un prodotto.");
        return;
    }

    // Salva temporaneamente i coperti e genera il riepilogo visivo
    dataManager.saveInstanceCoperti($("#coperti").val());
    graphicManager.popolaResoconto();

    // Cambia pagina
    $.mobile.pageContainer.pagecontainer("change", "#pageres");
});

// --- ELIMINA ORDINE (Reset totale) ---
$(document).on("click", "#elimina-ordine-btn", function (evt) {
    evt.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare l'ordine attuale?")) return;

    // Svuota i dati
    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");
    
    // Ricarica la pagina per pulire tutto
    location.reload();
});

// --- MODIFICA ORDINE (Torna indietro) ---
$(document).on("click", "#modifica-btn", function (evt) {
    evt.preventDefault();
    $.mobile.pageContainer.pagecontainer("change", "#pageprinc");
});

// --- CONFERMA ORDINE (Genera QR) ---
$(document).on("click", "#conferma-btn", function (evt) {
    evt.preventDefault();

    // Controllo validazione campi obbligatori
    var nome = $("#nomecliente").val();
    var tavolo = $("#tavolo").val();
    var coperti = $("#coperti").val();

    if (!nome || !tavolo || !coperti) {
        alert("Per favore, inserisci Nome, Tavolo e numero di Persone prima di procedere.");
        return;
    }

    // ✅ CHIAMA LA FUNZIONE CHE GENERA IL QR
    graphicManager.popolaQRCode();

    // Cambia pagina verso il QR Code
    $.mobile.pageContainer.pagecontainer("change", "#pageqrcode");
});

// --- NUOVO ORDINE (Dopo aver mostrato il QR) ---
$(document).on("click", "#nuovo-ordine-btn", function (evt) {
    evt.preventDefault();

    if (!confirm("Vuoi davvero iniziare un nuovo ordine?")) return;

    dataManager.saveInstanceHashmap(new HashMap());
    dataManager.saveInstanceCoperti("");
    
    location.reload();
});
