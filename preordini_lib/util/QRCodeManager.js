function QRCodeManager() {

    this.generaTestoOrdine = function () {

        const map = dataManager.getInstanceHashmap();
        const coperti = dataManager.getInstanceCoperti() || "";
        const nome = $("#nomecliente").val() || "";
        const tavolo = $("#tavolo").val() || "";

        let testo = "";
        let totale = 0;

        testo += "ORDINE\n";
        if (nome) testo += "Nome: " + nome + "\n";
        if (tavolo) testo += "Tavolo: " + tavolo + "\n";
        if (coperti) testo += "Coperti: " + coperti + "\n";
        testo += "------------------\n";

        elencoPrincipale.forEach(cat => {

            const articoli = (elencoPietanze[cat] || [])
                .filter(p => map.contains(parseInt(p.id)));

            if (articoli.length === 0) return;

            testo += cat.toUpperCase() + "\n";

            articoli.forEach(p => {
                const id = parseInt(p.id);
                const q = map.get(id);
                const prezzo = Number(p.prezzo) || 0;
                const subt = q * prezzo;

                totale += subt;

                testo += `${p.descrizione} x${q} = ${subt.toFixed(2)}€\n`;
            });

            testo += "\n";
        });

        testo += "------------------\n";
        testo += "TOTALE: " + totale.toFixed(2) + " €";

        return testo;
    };


    this.renderQRCode = function () {

        const testo = this.generaTestoOrdine();

        $("#qrcode").empty();

        new QRCode(document.getElementById("qrcode"), {
            text: testo,
            width: 256,
            height: 256
        });
    };
}
