function GraphicManager() {

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

                const id = String(p.id);
                const q = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${p.descrizione}</div>
                        <div class="center">${p.prezzo.toFixed(2)} €</div>
                        <div class="right">
                            <button id="minus${id}">−</button>
                            <span id="quantita${id}">${q}</span>
                            <button id="plus${id}">+</button>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        return html;
    };


    this.setButtonPlusMinus = function (hashmap) {

        elencoPrincipale.forEach(cat => {
            (elencoPietanze[cat] || []).forEach(p => {

                const id = String(p.id);

                $("#plus" + id).off().on("click", function () {
                    const q = (hashmap.get(id) || 0) + 1;
                    hashmap.put(id, q);
                    $("#quantita" + id).text(q);
                    dataManager.saveInstanceHashmap(hashmap);
                });

                $("#minus" + id).off().on("click", function () {
                    let q = (hashmap.get(id) || 0) - 1;
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


    this.popolaResoconto = function () {

        const map = dataManager.getInstanceHashmap();
        const ordine = map.map;

        if (Object.keys(ordine).length === 0) {
            $("#resoconto").html("<p>Il tuo ordine è vuoto</p>");
            return;
        }

        let html = "";
        let totale = 0;

        elencoPrincipale.forEach(cat => {

            const items = (elencoPietanze[cat] || [])
                .filter(p => ordine[p.id]);

            if (!items.length) return;

            html += `<h3>${cat}</h3>`;

            items.forEach(p => {
                const q = ordine[p.id];
                const subt = q * p.prezzo;
                totale += subt;

                html += `
                    <div>
                        ${p.descrizione} x${q} = ${subt.toFixed(2)} €
                    </div>
                `;
            });
        });

        html += `<hr><strong>Totale: ${totale.toFixed(2)} €</strong>`;
        $("#resoconto").html(html);
    };
}
