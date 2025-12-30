function GraphicManager() {
    this.generateMenu = function (hashmap) {
        let html = `
            <div class="form-ordine">
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
                <input type="number" id="coperti" placeholder="Quanti siete?" min="1">
            </div>`;

        elencoPrincipale.forEach(cat => {
            const articoli = elencoPietanze[cat] || [];
            html += `<div data-role="collapsible"><h4>${cat}</h4>`;
            articoli.forEach(p => {
                const id = String(p.id);
                const quantita = hashmap.contains(id) ? hashmap.get(id) : 0;
                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${p.descrizione}</div>
                        <div class="center">${Number(p.prezzo).toFixed(2)} €</div>
                        <div class="right controlli">
                            <button class="ui-btn brown-btn minus-btn" id="minus${id}">−</button>
                            <span id="quantita${id}">${quantita}</span>
                            <button class="ui-btn brown-btn plus-btn" id="plus${id}">+</button>
                        </div>
                        <div class="endBlock"></div>
                    </div>`;
            });
            html += `</div>`;
        });
        return html;
    };

    this.setButtonPlusMinus = function (hashmap) {
        elencoPrincipale.forEach(cat => {
            (elencoPietanze[cat] || []).forEach(p => {
                const id = String(p.id);
                $("#plus" + id).off().on("click", function () {
                    let q = (hashmap.get(id) || 0) + 1;
                    $("#quantita" + id).text(q);
                    hashmap.put(id, q);
                    dataManager.saveInstanceHashmap(hashmap);
                });
                $("#minus" + id).off().on("click", function () {
                    let q = Math.max((hashmap.get(id) || 0) - 1, 0);
                    $("#quantita" + id).text(q);
                    if (q === 0) hashmap.remove(id); else hashmap.put(id, q);
                    dataManager.saveInstanceHashmap(hashmap);
                });
            });
        });
    };

    this.popolaResoconto = function () {
        const hashmap = dataManager.getInstanceHashmap();
        const ordine = hashmap.toObject();
        let html = `<h3>Riepilogo: ${$("#nomecliente").val()}</h3>`;
        html += `<p>Tavolo: ${$("#tavolo").val()} - Persone: ${$("#coperti").val()}</p><hr>`;
        let totale = 0;

        elencoPrincipale.forEach(cat => {
            const articoli = (elencoPietanze[cat] || []).filter(p => ordine[String(p.id)] !== undefined);
            if (articoli.length === 0) return;
            html += `<h4>${cat}</h4>`;
            articoli.forEach(p => {
                const q = ordine[String(p.id)];
                const subtot = q * p.prezzo;
                totale += subtot;
                html += `<p>${p.descrizione} x${q} - ${subtot.toFixed(2)} €</p>`;
            });
        });
        $("#resoconto").html(html + `<hr><strong>Totale: ${totale.toFixed(2)} €</strong>`);
    };

    this.popolaQRCode = function () {
        $("#qrcode").empty();
        // Recupera la stringa codificata dal manager
        const testoCodificato = qrcodeManager.generaTestoOrdine();
        
        const qrCode = new QRCodeStyling({
            width: 280,
            height: 280,
            data: testoCodificato,
            dotsOptions: { color: "#43b261", type: "rounded" },
            cornersSquareOptions: { color: "#178435", type: "extra-rounded" }
        });
        qrCode.append(document.getElementById("qrcode"));
    };
}
