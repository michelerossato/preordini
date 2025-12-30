function QRCodeManager() {

    this.generaTestoOrdine = function () {
        var map = dataManager.getInstanceHashmap();
        var nome = $("#nomecliente").val() || "";
        var tavolo = $("#tavolo").val() || "";
        var coperti = $("#coperti").val() || "";

        // Creazione dell'oggetto ordine con la struttura richiesta
        var ordineOggetto = {
            numeroTavolo: tavolo,
            cliente: nome,
            coperti: coperti,
            righe: []
        };

        // Cicliamo le categorie e i piatti
        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) {
                // Verifichiamo la presenza in mappa usando l'ID del record
                return map.contains(String(p.ID)); 
            });

            articoli.forEach(function(p) {
                ordineOggetto.righe.push({
                    id: parseInt(p.ID), // Usiamo il campo ID del menuweb
                    qta: parseInt(map.get(String(p.ID)))
                });
            });
        });

        // Trasformazione in JSON e codifica URL (per ottenere %7B, %22, ecc.)
        var jsonString = JSON.stringify(ordineOggetto);
        var encodedString = encodeURIComponent(jsonString);

        return encodedString;
    };

    this.renderQRCode = function () {
        var testoCodificato = this.generaTestoOrdine();
        
        $("#qrcode").empty();
        
        // Generazione del QR Code tecnico
        var qrCode = new QRCodeStyling({
            width: 280,
            height: 280,
            type: "svg",
            data: testoCodificato,
            dotsOptions: {
                color: "#43b261",
                type: "rounded"
            },
            cornersSquareOptions: {
                color: "#178435",
                type: "extra-rounded"
            },
            backgroundOptions: {
                color: "#ffffff",
            }
        });
        
        qrCode.append(document.getElementById("qrcode"));
    };
}
