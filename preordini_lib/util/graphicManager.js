function GraphicManager() {

    // =============================================================
    // GENERA MENU
    // =============================================================
    this.generateMenu = function (hashmap) {

        let html = `
            <div class="form-ordine">
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
                <input type="number" id="coperti" placeholder="Quanti siete?" min="1">
            </div>
        `;

        elencoPrincipale.forEach(cat => {

            const articoli = elencoPietanze[cat] || [];

            html += `
                <div data-role="collapsible">
                    <h4>${cat}</h4>
            `;

            articoli.forEach(p => {

                const id = String(p.id);          // 🔥 STRINGA OVUNQUE
                const nome = p.descrizione || "";
                const prezzo = Number(p.prezzo) || 0;
                const qta = hashmap.get(id) || 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${nome}</div>
                        <div class="center prezzo-pietanza-ordine">
                            ${prezzo.toFixed(2)} €
                        </div>
                        <div class="right controlli">
                            <button class="ui-btn minus-btn" id="minus${id}">−</button>
                            <span id="quantita${id}">${qta}</span>
                            <button class="ui-btn plus-btn" id="plus${id}">+</button>
                        </div>
                        <div class="endBlock"></div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        return html;
    };


    // =============================================================
    // BOTTONI + / -
    // =============================================================
    this.setButtonPlusMinus = function (hashmap) {

        elencoPrincipale.forEach(cat => {

            (elencoPietanze[cat] || []).forEach(p => {

                const id = String(p.id);

                $("#plus" + id).off().on("click", function () {
                    let q = hashmap.get(id) || 0;
                    q++;
                    hashmap.put(id, q);
                    $("#quantita" + id).text(q);
                    dataManager.saveInstanceHashmap(hashmap);
                });

                $("#minus" + id).off().on("click", function () {
                    let q = hashmap.get(id) || 0;
                    q = Math.max(q - 1, 0);

                    if (q === 0) {
                        hashmap.remove(id);
                    } else {
                        hashmap.put(id, q);
                    }

                    $("#quantita" + id).text(q);
                    dataManager.saveInstanceHashmap(hashmap);
                });
            });
        });
    };


    // =============================================================
    // RESOCONTO (QUI ERA IL BUG)
    // =============================================================
    this.popolaResoconto = function () {

        const hashmap = dataManager.getInstanceHashmap();

        // ✅ CONTROLLO CORRETTO
        if (hashmap.size() === 0) {
            $("#resoconto").html("<p>Ordine vuoto</p>");
            return;
        }

        let html = "";
        let totale = 0;
        let totaleQta = 0;

        elencoPrincipale.forEach(cat => {

            const articoli = (elencoPietanze[cat] || [])
                .filter(p => hashmap.contains(String(p.id)));

            if (!articoli.length) return;

            html += `<h3>${cat}</h3>`;

            articoli.forEach(p => {

                const id = String(p.id);
                const q = hashmap.get(id);
                const prezzo = Number(p.prezzo) || 0;
                const subtot = q * prezzo;

                totale += subtot;
                totaleQta += q;

                html += `
                    <div class="riga-resoconto">
                        <div class="left">${p.descrizione}</div>
                        <div class="center">x${q}</div>
                        <div class="right">${subtot.toFixed(2)} €</div>
                        <div class="endBlock"></div>
                    </div>
                `;
            });
        });

        html += `
            <hr>
            <div class="riga-resoconto totale">
                <div class="left"><strong>Totale</strong></div>
                <div class="center"><strong>${totaleQta}</strong></div>
                <div class="right"><strong>${totale.toFixed(2)} €</strong></div>
            </div>
        `;

        $("#resoconto").html(html);
    };


    // =============================================================
    // QR CODE
    // =============================================================
    this.popolaQRCode = function () {

        const obj = dataManager.getInstanceHashmap().toObject();
        $("#qrcode").empty();

        new QRCode(document.getElementById("qrcode"), {
            text: JSON.stringify(obj),
            width: 256,
            height: 256
        });
    };
}
