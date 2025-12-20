function GraphicManager() {

    // =============================================================
    // MENU PRINCIPALE
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

            html += `<div data-role="collapsible"><h4>${cat}</h4>`;

            (elencoPietanze[cat] || []).forEach(p => {

                const id = p.id;
                const q = ordine[id] || 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${p.descrizione}</div>
                        <div class="center prezzo-pietanza-ordine">${p.prezzo.toFixed(2)} €</div>
                        <div class="right controlli">
                            <button class="ui-btn brown-btn minus-btn" data-id="${id}">−</button>
                            <span class="quantita-span" id="q_${id}">${q}</span>
                            <button class="ui-btn brown-btn plus-btn" data-id="${id}">+</button>
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
    this.setButtonPlusMinus = function (ordine) {

        $(".plus-btn").off().on("click", function () {
            const id = $(this).data("id");
            ordine[id] = (ordine[id] || 0) + 1;
            $("#q_" + id).text(ordine[id]);
            dataManager.saveInstanceOrdine(ordine);
        });

        $(".minus-btn").off().on("click", function () {
            const id = $(this).data("id");
            ordine[id] = Math.max((ordine[id] || 0) - 1, 0);

            if (ordine[id] === 0) delete ordine[id];

            $("#q_" + id).text(ordine[id] || 0);
            dataManager.saveInstanceOrdine(ordine);
        });
    };


    // =============================================================
    // RESOCONTO
    // =============================================================
    this.popolaResoconto = function () {

        const ordine = dataManager.getInstanceOrdine();
        let html = "";
        let totale = 0;
        let totaleQta = 0;

        if (Object.keys(ordine).length === 0) {
            $("#resoconto").html("<p>Il tuo ordine è vuoto</p>");
            return;
        }

        elencoPrincipale.forEach(cat => {

            const articoli = (elencoPietanze[cat] || [])
                .filter(p => ordine[p.id]);

            if (!articoli.length) return;

            html += `<h3>${cat}</h3>`;

            articoli.forEach(p => {
                const q = ordine[p.id];
                const subtot = q * p.prezzo;

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
}
