function QRCodeManager() {

    // =============================================================
    // GENERA TESTO ORDINE (Pulito per evitare caratteri strani)
    // =============================================================
    this.generaTestoOrdine = function () {
        var map = dataManager.getInstanceHashmap();
        var nome = $("#nomecliente").val() || "Non specificato";
        var tavolo = $("#tavolo").val() || "N/A";
        var coperti = $("#coperti").val() || "1";

        var testo = "--- ORDINE GIOVANI DESE ---\n";
        testo += "CLIENTE: " + nome + "\n";
        testo += "TAVOLO: " + tavolo + "\n";
        testo += "COPERTI: " + coperti + "\n";
        testo += "---------------------------\n";

        var totale = 0;

        elencoPrincipale.forEach(function(cat) {
            // Filtra gli articoli presenti nella mappa per questa categoria
            var articoli = (elencoPietanze[cat] || []).filter(function(p) {
                return map.contains(String(p.id));
            });

            if (articoli.length === 0) return;

            testo += "\n" + cat.toUpperCase() + ":\n";

            articoli.forEach(function(p) {
                var q = map.get(String(p.id));
                var prezzo = Number(p.prezzo) || 0;
                var subt = q * prezzo;

                totale += subt;
                // Usiamo "EUR" invece del simbolo € per evitare errori di codifica nel QR
                testo += "- " + p.descrizione + " x" + q + " : " + subt.toFixed(2) + " EUR\n";
            });
        });

        testo += "\n---------------------------\n";
        testo += "TOTALE ORDINE: " + totale.toFixed(2) + " EUR";

        return testo;
    };

    // =============================================================
    // RENDER QR CODE (Standard di riserva)
    // =============================================================
    this.renderQRCode = function () {
        var testo = this.generaTestoOrdine();
        $("#qrcode").empty();
        
        // Se usi la libreria standard qrcode.js:
        new QRCode(document.getElementById("qrcode"), {
            text: testo,
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    };
}
