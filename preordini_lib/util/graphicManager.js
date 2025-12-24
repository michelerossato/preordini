function GraphicManager() {

    // =============================================================
    // MENU
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

                const id = parseInt(p.id);
                const q = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left">${p.descrizione}</div>
                        <div class="center">${p.prezzo.toFixed(2)} €</div>
                        <div class="right">
                            <button id="minus${id}" class="ui-btn">−</button>
                            <span id="quantita${id}">${q}</span>
                            <button id="plus${id}" class="ui-btn">+</button>
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

                const id = parseInt(p.id);

                $("#plus" + id).off().on("click", function () {

                    let q = hashmap.contains(id) ? hashmap.get(id) : 0;
                    q++;

                    hashmap.put(id, q);
                    $("#quantita" + id).text(q);

                    dataManager.saveInstanceHashmap(hashmap);
                });

                $("#minus" + id).off().on("click", function () {

                    if (!hashmap.contains(id)) return;

                    let q = hashmap.get(id) - 1;

                    if (q <= 0) {
                        hashmap.remove(id);
                        q = 0;
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
    // RESOCONTO (🔥 ORA FUNZIONA)
    // =============================================================
    this.popolaResoconto = function () {

        const map = dataManager.getInstanceHashmap();

        if (map.isEmpty()) {
            $("#resoconto").html("<p>Ordine vuoto</p>");
            return;
        }

        let html = "";
        let totale = 0;

        elencoPrincipale.forEach(cat => {

            const articoli = (elencoPietanze[cat] || [])
                .filter(p => map.contains(parseInt(p.id)));

            if (!articoli.length) return;

            html += `<h3>${cat}</h3>`;

            articoli.forEach(p => {

                const id = parseInt(p.id);
                const q = map.get(id);
                const subt = q * p.prezzo;
                totale += subt;

                html += `
                    <div class="riga-resoconto">
                        <span>${p.descrizione} x${q}</span>
                        <span>${subt.toFixed(2)} €</span>
                    </div>
                `;
            });
        });

        html += `<hr><strong>Totale: ${totale.toFixed(2)} €</strong>`;
        $("#resoconto").html(html);
    };
}
