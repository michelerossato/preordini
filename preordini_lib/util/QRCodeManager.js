function QRCodeManager() {

    this.generaTestoOrdine = function () {
        var map = dataManager.getInstanceHashmap();
        var nome = $("#nomecliente").val() || "";
        var tavolo = $("#tavolo").val() || "";
        var coperti = $("#coperti").val() || ""; // Preso dall'input nel menu

        var testo = "";
        var totale = 0;

        testo += "ORDINE\n";
        if (nome)   testo += "Nome: " + nome + "\n";
        if (tavolo) testo += "Tavolo: " + tavolo + "\n";
        if (coperti) testo += "Coperti: " + coperti + "\n";
        testo += "------------------\n";

        elencoPrincipale.forEach(function(cat) {
            // Usiamo String(p.id) per sicurezza di compatibilità
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
                testo += p.descrizione + " x" + q + " = " + subt.toFixed(2) + "€\n";
            });
        });

        testo += "------------------\n";
        testo += "TOTALE: " + totale.toFixed(2) + " €";

        return testo;
    };

    // Questa funzione viene chiamata dal GraphicManager per disegnare il QR
    this.renderQRCode = function () {
        // Se usi la libreria qr-code-styling nell'index, 
        // la logica del disegno è gestita dentro graphicManager.js
        // chiamando semplicemente generaTestoOrdine().
        console.log("Generazione testo per QR Code completata.");
    };
}
