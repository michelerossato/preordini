function GraphicManager() {

    // =============================================================
    // GENERA MENU PRINCIPALE
    // =============================================================
    this.generateMenu = function (hashmap) {

        let html = `
            <div class="form-ordine">
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
                <input type="number" id="coperti" placeholder="Quanti siete?" min="1">
            </div>
        `;

        // Categorie
        elencoPrincipale.forEach(cat => {

            const articoli = elencoPietanze[cat] || [];

            html += `
                <div data-role="collapsible">
                    <h4>${cat}</h4>
            `;

            articoli.forEach(a => {

                const id = a.id;
                const nome = a.descrizione || a.nome || "";
                const prezzo = parseFloat(a.prezzo) || 0;
                const quantita = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${nome}</div>

                        <div class="center prezzo-pietanza-ordine">
                            ${prezzo.toFixed(2)} €
                        </div>

                        <div class="right controlli">
                            <button class="ui-btn brown-btn minus-btn" id="minus${id}">−</button>
                            <span id="quantita${id}" class="quantita-span">${quantita}</span>
                            <button class="ui-btn brown-btn plus-btn" id="plus${id}">+</button>
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
    // BOTTONI + / −
    // =============================================================
    this.setButtonPlusMinus = function (hashmap) {

        elencoPrincipale.forEach(cat => {

            const articoli = elencoPietanze[cat] || [];

            articoli.forEach(p => {

                const id = p.id;

                // +
                $("#plus" + id).off().on("click", function () {
                    let q = parseInt($("#quantita" + id).text()) || 0;
                    q++;

                    $("#quantita" + id).text(q);
                    hashmap.put(id, q);
                    dataManager.saveInstanceHashmap(hashmap);
                });

                // −
                $("#minus" + id).off().on("click", function () {
                    let q = parseInt($("#quantita" + id).text()) || 0;
                    q = Math.max(q - 1, 0);

                    $("#quantita" + id).text(q);

                    if (q === 0) {
                        hashmap.remove(id);
                    } else {
                        hashmap.put(id, q);
                    }

                    dataManager.saveInstanceHashmap(hashmap);
                });

            });

        });
    };


    // =============================================================
    // RESOCONTO ORDINE
    // =============================================================
    this.popolaResoconto = function () {

        const hashmap = dataManager.getInstanceHashmap();
        let html = "";
        let totale = 0;
        let totaleQta = 0;

        elencoPrincipale.forEach(cat => {

            const articoli = (elencoPietanze[cat] || [])
                .filter(p => hashmap.contains(p.id));

            if (articoli.length === 0) return;

            html += `<h3>${cat}</h3>`;

            articoli.forEach(p => {

                const q = hashmap.get(p.id);
                const prezzo = parseFloat(p.prezzo) || 0;
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
                <div class="endBlock"></div>
            </div>
        `;

        $("#resoconto").html(html);
    };


    // =============================================================
    // QR CODE
    // =============================================================
    this.popolaQRCode = function () {

        const hash = dataManager.getInstanceHashmap().toObject();

        $("#qrcode").empty();

        new QRCode(document.getElementById("qrcode"), {
            text: JSON.stringify(hash),
            width: 256,
            height: 256
        });
    };


    // =============================================================
    // POPUP ORDINE VUOTO
    // =============================================================
    this.generatePopup = function () {

        $("#info-ordine-popup").html(`
            <p>Il tuo ordine è vuoto.</p>
            <button class="ui-btn green-btn" id="ok-popup-btn">OK</button>
        `);

        $("#ok-popup-btn").off().on("click", function () {
            $("#popup-ordine").popup("close");
        });
    };

}
