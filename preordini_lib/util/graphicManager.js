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

            html += `<div data-role="collapsible"><h4>${cat}</h4>`;

            (elencoPietanze[cat] || []).forEach(p => {

                const id = p.id;
                const q = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left">${p.descrizione}</div>
                        <div class="center">${p.prezzo.toFixed(2)} €</div>
                        <div class="right">
                            <button class="minus" id="minus${id}">−</button>
                            <span id="q${id}">${q}</span>
                            <button class="plus" id="plus${id}">+</button>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        return html;
    };


    // =============================================================
    // + / -
    // =============================================================
    this.setButtonPlusMinus = function (hashmap) {

        elencoPrincipale.forEach(cat => {
            (elencoPietanze[cat] || []).forEach(p => {

                const id = p.id;

                $("#plus" + id).off().on("click", () => {
                    let q = parseInt($("#q" + id).text()) || 0;
                    q++;
                    $("#q" + id).text(q);
                    hashmap.put(id, q);
                    dataManager.saveInstanceHashmap(hashmap);
                });

                $("#minus" + id).off().on("click", () => {
                    let q = parseInt($("#q" + id).text()) || 0;
                    q = Math.max(0, q - 1);
                    $("#q" + id).text(q);
                    if (q === 0) hashmap.remove(id);
                    else hashmap.put(id, q);
                    dataManager.saveInstanceHashmap(hashmap);
                });
            });
        });
    };


    // =============================================================
    // RESOCONTO
    // =============================================================
    this.popolaResoconto = function () {

        const map = dataManager.getInstanceHashmap();

        if (map.size() === 0) {
            $("#resoconto").html("<p>Il tuo ordine è vuoto</p>");
            return;
        }

        let html = "";
        let totale = 0;

        elencoPrincipale.forEach(cat => {

            const articoli = (elencoPietanze[cat] || [])
                .filter(p => map.contains(p.id));

            if (!articoli.length) return;

            html += `<h3>${cat}</h3>`;

            articoli.forEach(p => {
                const q = map.get(p.id);
                const subt = q * p.prezzo;
                totale += subt;

                html += `
                    <div class="riga-resoconto">
                        <div>${p.descrizione}</div>
                        <div>x${q}</div>
                        <div>${subt.toFixed(2)} €</div>
                    </div>
                `;
            });
        });

        html += `<h3>Totale: ${totale.toFixed(2)} €</h3>`;
        $("#resoconto").html(html);
    };
}
