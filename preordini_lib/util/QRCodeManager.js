function QRCodeManager() {

    this.generaTestoOrdine = function () {
        var map = dataManager.getInstanceHashmap();
        var nome = $("#nomecliente").val() || "cliente";
        var tavolo = $("#tavolo").val() || "0";
        var coperti = $("#coperti").val() || "1";

        // Rimuoviamo i due punti e i simboli speciali che diventano 'ç' o 'ì'
        var testo = "--- ORDINE GIOVANI DESE ---\n";
        testo += "NOME  " + nome.toUpperCase() + "\n";
        testo += "TAVOLO  " + tavolo + "\n";
        testo += "COPERTI  " + coperti + "\n";
        testo += "---------------------------\n";

        var totale = 0;

        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) {
                return map.contains(String(p.id));
            });

            if (articoli.length === 0) return;

            testo += "\n" + cat.toUpperCase() + "\n";

            articoli.forEach(function(p) {
                var q = map.get(String(p.id));
                var prezzo = Number(p.prezzo) || 0;
                var subt = q * prezzo;
                totale += subt;

                // Pulizia nome piatto: togliamo accenti (es: acqua, ragu)
                var desc = p.descrizione
                    .replace(/[àá]/g, "a")
                    .replace(/[èé]/g, "e")
                    .replace(/[ìí]/g, "i")
                    .replace(/[òó]/g, "o")
                    .replace(/[ùú]/g, "u")
                    .replace(/[']/g, " ");

                // Usiamo spazi o trattini invece di : o =
                testo += "- " + desc + " x" + q + "  " + subt.toFixed(2) + " EUR\n";
            });
        });

        testo += "\n---------------------------\n";
        testo += "TOTALE  " + totale.toFixed(2) + " EUR";

        return testo;
    };

    this.renderQRCode = function () {
        var testo = this.generaTestoOrdine();
        $("#qrcode").empty();
        
        new QRCode(document.getElementById("qrcode"), {
            text: testo,
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M // Livello medio per evitare che il QR diventi troppo denso
        });
    };
}
