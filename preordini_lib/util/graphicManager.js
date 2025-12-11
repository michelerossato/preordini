function GraphicManager() {

    // ------------------------------------------------------------
    // GENERA IL MENU PRINCIPALE
    // ------------------------------------------------------------
    this.generateMenu = function (hashmap) {

        let html = `
            <div>
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
                <input type="text" id="coperti" placeholder="Quanti siete?">
            </div>
        `;

        // Per ogni categoria
        elencoPrincipale.forEach(cat => {

            const articoli = elencoPietanze[cat];

            html += `
                <div data-role="collapsible">
                    <h4>${cat}</h4>
            `;

            articoli.forEach(a => {

                const quantita = hashmap.contains(a.id) ? hashmap.get(a.id) : 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${a.descrizione}</div>
                        <div class="center prezzo-pietanza-ordine">${a.prezzo.toFixed(2)} €</div>

                        <div class="right">
                            <button class="ui-btn brown-btn minus-btn" id="minus${a.id}">-</button>

                            <span id="quantita${a.id}" class="quantita-span">${quantita}</span>

                            <button class="ui-btn brown-btn plus-btn" id="plus${a.id}">+</button>
                        </div>
                        <div class="endBlock"></div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        return html;
    };


    // ------------------------------------------------------------
    // GESTIONE BOTTONI + e -
    // ------------------------------------------------------------
    this.setButtonPlusMinus = function (hashmap) {

        const dataManager = new Data();

        elencoPrincipale.forEach(cat => {

            elencoPietanze[cat].forEach(p => {

                // Bottone +
                $(`#plus${p.id}`).off().on("click", function () {
                    let q = parseInt($(`#quantita${p.id}`).text()) + 1;
                    $(`#quantita${p.id}`).text(q);

                    hashmap.put(p.id, q);
                    dataManager.saveInstanceHashmap(hashmap);
                });

                // Bottone -
                $(`#minus${p.id}`).off().on("click", function () {
                    let q = Math.max(parseInt($(`#quantita${p.id}`).text()) - 1, 0);
                    $(`#quantita${p.id}`).text(q);

                    if (q === 0) hashmap.remove(p.id);
                    else hashmap.put(p.id, q);

                    dataManager.saveInstanceHashmap(hashmap);
                });

            });

        });

    };


    // ------------------------------------------------------------
    // POPOLA IL RESOCONTO
    // ------------------------------------------------------------
    this.popolaResoconto = function () {
        let html = "";
        let hashmap = dataManager.getInstanceHashmap();

        const dati = hashmap.toArray();
        let totale = 0;
        let quantTot = 0;

        elencoPrincipale.forEach(cat => {

            const articoli = elencoPietanze[cat].filter(x => hashmap.contains(x.id));

            if (articoli.length === 0) return;

            html += `<h3>${cat}</h3>`;

            articoli.forEach(p => {

                const q = hashmap.get(p.id);
                const prezzoTot = q * p.prezzo;

                totale += prezzoTot;
                quantTot += q;

                html += `
                    <div class="riga-resoconto">
                        <div>${p.descrizione}</div>
                        <div>x${q}</div>
                        <div>${prezzoTot.toFixed(2)} €</div>
                    </div>
                `;
            });

        });

        html += `
            <hr>
            <h3>Totale: ${totale.toFixed(2)} €</h3>
        `;

        $("#resoconto").html(html);
    };


    // ------------------------------------------------------------
    // QR CODE
    // ------------------------------------------------------------
    this.popolaQRCode = function () {
        const hash = dataManager.getInstanceHashmap().toObject();
        $("#qrcode").empty();

        new QRCode(document.getElementById("qrcode"), {
            text: JSON.stringify(hash),
            width: 256,
            height: 256
        });
    };


    // ------------------------------------------------------------
    // POPUP
    // ------------------------------------------------------------
    this.generatePopup = function (id, dataElimina) {
        $("#info-ordine-popup").html(`
            <p>Il tuo ordine è vuoto.</p>
            <button class="ui-btn green-btn">OK</button>
        `);
    };

}
