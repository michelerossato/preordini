function QRCodeManager() {

    this.generaTestoOrdine = function () {
        var map = dataManager.getInstanceHashmap();
        var nome = $("#nomecliente").val() || "cliente";
        var tavolo = $("#tavolo").val() || "0";
        var coperti = $("#coperti").val() || "1";

        // Costruiamo il testo usando solo SPAZI invece di DUE PUNTI
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

                // PULIZIA TOTALE: Rimuoviamo accenti e simboli che causano errori (ç, ì, ò)
                var desc = p.descrizione
                    .replace(/[àá]/g, "a")
                    .replace(/[èé]/g, "e")
                    .replace(/[ìí]/g, "i")
                    .replace(/[òó]/g, "o")
                    .replace(/[ùú]/g, "u")
                    .replace(/[’']/g, " ") // toglie apostrofi
                    .replace(/[^a-zA-Z0-9 ]/g, " "); // rimuove tutto ciò che non è lettera o numero

                testo += "- " + desc.toUpperCase() + " x" + q + "  " + subt.toFixed(2) + " EUR\n";
            });
        });

        testo += "\n---------------------------\n";
        testo += "TOTALE  " + totale.toFixed(2) + " EUR";

        return testo;
    };

    this.renderQRCode = function () {
        // Forza la codifica pulita
        var testoGrezzo = this.generaTestoOrdine();
        
        // Funzione per forzare UTF-8 se il lettore è vecchio (opzionale)
        function toUtf8(str) {
            return unescape(encodeURIComponent(str));
        }

        $("#qrcode").empty();
        
        new QRCode(document.getElementById("qrcode"), {
            text: toUtf8(testoGrezzo),
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M
        });
    };
}
