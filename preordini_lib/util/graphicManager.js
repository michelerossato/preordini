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
            if (articoli.length === 0) return; 

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

    // AGGIORNATO: Ora calcola il totale Euro
    this.popolaResoconto = function () {
        const hashmap = dataManager.getInstanceHashmap();
        let html = `<h3>Riepilogo Ordine</h3>
                    <p><b>Nome:</b> ${$("#nomecliente").val()}<br>
                    <b>Tavolo:</b> ${$("#tavolo").val()}<br>
                    <b>Persone:</b> ${$("#coperti").val()}</p><hr>`;
        
        let totaleComplessivo = 0;

        elencoPrincipale.forEach(cat => {
            const articoliOrdinati = (elencoPietanze[cat] || []).filter(p => hashmap.contains(String(p.id)));
            
            if (articoliOrdinati.length > 0) {
                html += `<div style="background:#444; padding:5px; margin-top:10px;"><b>${cat}</b></div>`;
                articoliOrdinati.forEach(p => {
                    const qta = hashmap.get(String(p.id));
                    const prezzoUnitario = Number(p.prezzo) || 0;
                    const subTotale = qta * prezzoUnitario;
                    totaleComplessivo += subTotale;

                    html += `<div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #555;">
                                <span>${p.descrizione} x ${qta}</span>
                                <span>${subTotale.toFixed(2)} €</span>
                             </div>`;
                });
            }
        });

        html += `<hr><div style="text-align:right; font-size:1.2em; margin-top:10px;">
                    <strong>TOTALE ORDINE: ${totaleComplessivo.toFixed(2)} €</strong>
                 </div>`;
        
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
