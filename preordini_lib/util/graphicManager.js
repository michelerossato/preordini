function GraphicManager() {

    // =============================================================
    // GENERA MENU
    // =============================================================
    this.generateMenu = function (ordine) {

        let html = `
            <div class="form-ordine">
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
                <input type="number" id="coperti" placeholder="Quanti siete?" min="1">
            </div>
        `;

        elencoPrincipale.forEach(cat => {

            const articoli = elencoPietanze[cat] || [];

            html += `<div data-role="collapsible"><h4>${cat}</h4>`;

            articoli.forEach(p => {

                const id = String(p.id);
                const nome = p.descrizione || p.nome || "";
                const prezzo = Number(p.prezzo) || 0;
                const qta = ordine[id] || 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${nome}</div>
                        <div class="center prezzo-pietanza-ordine">${prezzo.toFixed(2)} €</div>
                        <div class="right controlli">
                            <button class="ui-btn brown-btn minus-btn" id="minus${id}">−</button>
                            <span id="quantita${id}" class="quantita-span">${qta}</span>
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
    this.setButtonPlusMinus = function (ordine) {

        elencoPrincipale.forEach(cat => {
            (elencoPietanze[cat] || []).forEach(p => {

                const id = String(p.id);

                $("#plus" + id).off().on("click", function () {
                    ordine[id] = (ordine[id] || 0) + 1;
                    $("#quantita" + id).text(ordine[id]);
                    dataManager.saveInstanceHashmap(ordine);
                });

                $("#minus" + id).off().on("click", function () {
                    ordine[id] = Math.max((ordine[id] || 0) - 1, 0);

                    if (ordine[id] === 0) delete ordine[id];

                    $("#quantita" + id).text(ordine[id] || 0);
                    dataManager.saveInstanceHashmap(ordine);
                });
            });
        });
    };


    // =============================================================
    // RESOCONTO
    // =============================================================
    this.popolaResoconto = function () {

        const ordine = dataManager.getInstanceHashmap();

        if (Object.keys(ordine).length === 0) {
            $("#resoconto").html("<p>Il tuo ordine è vuoto</p>");
            return;
        }

        let html = "";
        let totale = 0;
        let totaleQta = 0;

        elencoPrincipale.forEach(cat => {

            const articoli = (elencoPietanze[cat] || [])
                .filter(p => ordine[String(p.id)] !== undefined);

            if (!articoli.length) return;

            html += `<h3>${cat}</h3>`;

            articoli.forEach(p => {

                const id = String(p.id);
                const q = ordine[id];
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
                <div class="endBlock"></div>
            </div>
        `;

        $("#resoconto").html(html);
    };


    // =============================================================
    // QR CODE
    // =============================================================
    this.popolaQRCode = function () {
        $("#qrcode").empty();
        new QRCode(document.getElementById("qrcode"), {
            text: JSON.stringify(dataManager.getInstanceHashmap()),
            width: 256,
            height: 256
        });
    };


    // =============================================================
    // POPUP
    // =============================================================
    this.generatePopup = function () {
        $("#info-ordine-popup").html(`
            <p>Il tuo ordine è vuoto.</p>
            <button class="ui-btn green-btn" id="ok-popup-btn">OK</button>
        `);
        $("#ok-popup-btn").off().on("click", () => {
            $("#popup-ordine").popup("close");
        });
    };
}
