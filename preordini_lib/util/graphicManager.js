function GraphicManager() {

    this.generateMenu = function (hashmap) {
        let html = `
            <div class="form-ordine">
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
            </div>
        `;
        elencoPrincipale.forEach(cat => {
            const articoli = elencoPietanze[cat] || [];
            html += `<div data-role="collapsible"><h4>${cat}</h4>`;
            articoli.forEach(p => {
                const id = String(p.id);
                const quantita = hashmap.contains(id) ? hashmap.get(id) : 0;
                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left">${p.descrizione}</div>
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
        $(document).off("click", ".plus-btn, .minus-btn").on("click", ".plus-btn, .minus-btn", function () {
            const isPlus = $(this).hasClass("plus-btn");
            const id = $(this).attr("id").replace(isPlus ? "plus" : "minus", "");
            let q = hashmap.contains(id) ? hashmap.get(id) : 0;
            q = isPlus ? q + 1 : Math.max(0, q - 1);
            if (q === 0) hashmap.remove(id); else hashmap.put(id, q);
            $(`#quantita${id}`).text(q);
            dataManager.saveInstanceHashmap(hashmap);
        });
    };

    this.popolaResoconto = function () {
        const hashmap = dataManager.getInstanceHashmap();
        let html = "";
        elencoPrincipale.forEach(cat => {
            const articoli = (elencoPietanze[cat] || []).filter(p => hashmap.contains(String(p.id)));
            if (articoli.length > 0) {
                html += `<h3>${cat}</h3>`;
                articoli.forEach(p => {
                    html += `<p>${p.descrizione} x ${hashmap.get(String(p.id))}</p>`;
                });
            }
        });
        $("#resoconto").html(html || "<p>Ordine vuoto</p>");
    };

    // =============================================================
    // QR CODE MODERNO (Arrotondato e Verde)
    // =============================================================
    this.popolaQRCode = function () {
        $("#qrcode").empty();
        
        // Usiamo il testo formattato da QRCodeManager
        const testoOrdine = qrcodeManager.generaTestoOrdine();

        const qrCode = new QRCodeStyling({
            width: 280,
            height: 280,
            type: "svg",
            data: testoOrdine,
            dotsOptions: {
                color: "#43b261", // Verde dal tuo CSS
                type: "rounded"
            },
            cornersSquareOptions: {
                color: "#178435", // Verde scuro dal tuo CSS
                type: "extra-rounded"
            },
            backgroundOptions: {
                color: "#ffffff",
            }
        });

        qrCode.append(document.getElementById("qrcode"));
    };
}
