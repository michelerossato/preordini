function GraphicManager() {

    // ... (tieni le tue funzioni generateMenu e setButtonPlusMinus come sono) ...

    this.popolaResoconto = function () {
        var hashmap = dataManager.getInstanceHashmap();
        var html = "";
        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) { return hashmap.contains(String(p.id)); });
            if (articoli.length === 0) return;
            html += '<h3>' + cat + '</h3>';
            articoli.forEach(function(p) {
                var q = hashmap.get(String(p.id));
                html += '<p>' + p.descrizione + ' x ' + q + '</p>';
            });
        });
        $("#resoconto").html(html || "<p>Nessun piatto selezionato</p>");
    };

    // =============================================================
    // QR CODE (SISTEMATO)
    // =============================================================
    this.popolaQRCode = function () {
        // 1. Puliamo il div del QR
        $("#qrcode").empty();

        // 2. RECUPERIAMO IL TESTO LEGGIBILE (Fondamentale!)
        // Invece di JSON.stringify, usiamo il manager dedicato
        var testoOrdine = qrcodeManager.generaTestoOrdine();

        // 3. Generiamo il QR stilizzato (Verde e Arrotondato)
        const qrCode = new QRCodeStyling({
            width: 280,
            height: 280,
            type: "svg",
            data: testoOrdine, // Qui ora ci sarà: "ORDINE - Tavolo: X..."
            dotsOptions: {
                color: "#43b261", // Il tuo verde chiaro
                type: "rounded"
            },
            cornersSquareOptions: {
                color: "#178435", // Il tuo verde scuro
                type: "extra-rounded"
            },
            backgroundOptions: {
                color: "#ffffff",
            }
        });

        qrCode.append(document.getElementById("qrcode"));
    };

    this.generatePopup = function () {
        $("#info-ordine-popup").html('<p>Il tuo ordine è vuoto.</p><button class="ui-btn green-btn" id="ok-popup-btn">OK</button>');
        $("#ok-popup-btn").off().on("click", function() { $("#popup-ordine").popup("close"); });
    };
}
