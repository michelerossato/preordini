function GraphicManager() {

    this.generateMenu = function (hashmap) {
        var html = '<div class="form-ordine">' +
                   '<input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">' +
                   '<input type="text" id="tavolo" placeholder="Numero tavolo">' +
                   '</div>';

        elencoPrincipale.forEach(function(cat) {
            var articoli = elencoPietanze[cat] || [];
            html += '<div data-role="collapsible"><h4>' + cat + '</h4>';
            articoli.forEach(function(p) {
                var id = String(p.id);
                var nome = p.descrizione || "";
                var prezzo = Number(p.prezzo) || 0;
                var quantita = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += '<div class="content-pietanza-ordine">' +
                        '<div class="left">' + nome + '</div>' +
                        '<div class="center">' + prezzo.toFixed(2) + ' €</div>' +
                        '<div class="right">' +
                        '<button class="minus-btn" id="minus' + id + '">−</button>' +
                        '<span id="quantita' + id + '">' + quantita + '</span>' +
                        '<button class="plus-btn" id="plus' + id + '">+</button>' +
                        '</div><div class="endBlock"></div></div>';
            });
            html += '</div>';
        });
        return html;
    };

    this.setButtonPlusMinus = function (hashmap) {
        $(document).off("click", ".plus-btn, .minus-btn").on("click", ".plus-btn, .minus-btn", function () {
            var isPlus = $(this).hasClass("plus-btn");
            var id = $(this).attr("id").replace(isPlus ? "plus" : "minus", "");
            var q = hashmap.contains(id) ? hashmap.get(id) : 0;
            q = isPlus ? q + 1 : Math.max(0, q - 1);
            if (q === 0) hashmap.remove(id); else hashmap.put(id, q);
            $(`#quantita${id}`).text(q);
            dataManager.saveInstanceHashmap(hashmap);
        });
    };

    this.popolaResoconto = function () {
        var hashmap = dataManager.getInstanceHashmap();
        var html = "";
        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) { return hashmap.contains(String(p.id)); });
            if (articoli.length > 0) {
                html += '<h3>' + cat + '</h3>';
                articoli.forEach(function(p) {
                    html += '<p>' + p.descrizione + ' x ' + hashmap.get(String(p.id)) + '</p>';
                });
            }
        });
        $("#resoconto").html(html || "<p>Ordine vuoto</p>");
    };

    this.popolaQRCode = function () {
        $("#qrcode").empty();
        // USA IL TESTO LEGGIBILE PER IL RISTORATORE
        var testoOrdine = qrcodeManager.generaTestoOrdine();

        var qrCode = new QRCodeStyling({
            width: 280,
            height: 280,
            data: testoOrdine,
            dotsOptions: { color: "#43b261", type: "rounded" },
            cornersSquareOptions: { color: "#178435", type: "extra-rounded" }
        });
        qrCode.append(document.getElementById("qrcode"));
    };
}
