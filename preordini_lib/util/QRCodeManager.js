function QRCodeManager() {
    this.generaTestoOrdine = function () {
        var map = dataManager.getInstanceHashmap();
        var nome = $("#nomecliente").val() || "";
        var tavolo = $("#tavolo").val() || "";
        var coperti = $("#coperti").val() || "";

        // Struttura JSON richiesta
        var ordineOggetto = {
            numeroTavolo: tavolo,
            cliente: nome,
            coperti: coperti,
            righe: []
        };

        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) {
                return map.contains(String(p.ID)); 
            });

            articoli.forEach(function(p) {
                ordineOggetto.righe.push({
                    id: parseInt(p.ID),
                    qta: parseInt(map.get(String(p.ID)))
                });
            });
        });

        // Trasformazione in stringa JSON e codifica URL
        return encodeURIComponent(JSON.stringify(ordineOggetto));
    };

    this.renderQRCode = function () {
        // La logica di disegno è gestita in graphicManager tramite QRCodeStyling
    };
}
