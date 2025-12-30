function QRCodeManager() {
    this.generaTestoOrdine = function () {
        var map = dataManager.getInstanceHashmap();
        var nome = $("#nomecliente").val() || "";
        var tavolo = $("#tavolo").val() || "";
        var coperti = $("#coperti").val() || "";

        var ordineOggetto = {
            numeroTavolo: tavolo,
            cliente: nome,
            coperti: coperti,
            righe: []
        };

        // Prende i dati dalle variabili globali popolate da data.js
        elencoPrincipale.forEach(function(cat) {
            (elencoPietanze[cat] || []).forEach(function(p) {
                var idStr = String(p.id);
                if (map.contains(idStr)) {
                    ordineOggetto.righe.push({
                        id: parseInt(p.id),
                        qta: map.get(idStr)
                    });
                }
            });
        });

        // Restituisce la stringa codificata per il QR
        return encodeURIComponent(JSON.stringify(ordineOggetto));
    };
}
