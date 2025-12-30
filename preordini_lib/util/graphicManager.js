function GraphicManager() {
    // Genera il menu filtrando le categorie vuote
    this.generateMenu = function (hashmap) {
        let html = `
            <div class="form-ordine" style="padding:15px; background:#222; border-radius:10px; margin-bottom:20px;">
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
                <input type="number" id="coperti" placeholder="Quanti siete?" min="1">
            </div>`;

        elencoPrincipale.forEach(cat => {
            const articoli = elencoPietanze[cat] || [];
            if (articoli.length === 0) return; // Salta categorie senza articoli disponibili

            html += `<div data-role="collapsible"><h4>${cat}</h4>`;
            articoli.forEach(p => {
                const id = String(p.id);
                const qta = hashmap.contains(id) ? hashmap.get(id) : 0;
                html += `
                    <div class="content-pietanza-ordine" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div style="width:50%">${p.descrizione}</div>
                        <div style="width:20%">${Number(p.prezzo).toFixed(2)} €</div>
                        <div style="width:30%; text-align:right;">
                            <button class="ui-btn ui-btn-inline minus-btn" id="minus${id}">−</button>
                            <span id="quantita${id}">${qta}</span>
                            <button class="ui-btn ui-btn-inline plus-btn" id="plus${id}">+</button>
                        </div>
                    </div>`;
            });
            html += `</div>`;
        });
        return html;
    };

    this.setButtonPlusMinus = function (hashmap) {
        $(document).off("click", ".plus-btn, .minus-btn").on("click", ".plus-btn, .minus-btn", function() {
            const isPlus = $(this).hasClass("plus-btn");
            const id = $(this).attr("id").replace(isPlus ? "plus" : "minus", "");
            let q = hashmap.contains(id) ? hashmap.get(id) : 0;
            q = isPlus ? q + 1 : Math.max(0, q - 1);
            if (q === 0) hashmap.remove(id); else hashmap.put(id, q);
            $("#quantita" + id).text(q);
            dataManager.saveInstanceHashmap(hashmap);
        });
    };

    this.popolaResoconto = function () {
        const hashmap = dataManager.getInstanceHashmap();
        let html = `<h3>Riepilogo</h3><p>Nome: ${$("#nomecliente").val()}<br>Tavolo: ${$("#tavolo").val()}<br>Persone: ${$("#coperti").val()}</p><hr>`;
        
        elencoPrincipale.forEach(cat => {
            const articoli = (elencoPietanze[cat] || []).filter(p => hashmap.contains(String(p.id)));
            if (articoli.length > 0) {
                html += `<b>${cat}</b>`;
                articoli.forEach(p => {
                    html += `<p>${p.descrizione} x ${hashmap.get(String(p.id))}</p>`;
                });
            }
        });
        $("#resoconto").html(html);
    };

    this.popolaQRCode = function () {
        $("#qrcode").empty();
        try {
            const testoQR = qrcodeManager.generaTestoOrdine();
            const qrCode = new QRCodeStyling({
                width: 300,
                height: 300,
                data: testoQR,
                type: "svg",
                dotsOptions: { color: "#000000", type: "square" },
                cornersSquareOptions: { color: "#000000", type: "square" },
                backgroundOptions: { color: "#ffffff" }
            });
            qrCode.append(document.getElementById("qrcode"));
        } catch (e) { console.error("Errore QR:", e); }
    };
}
