function GraphicManager() {
    this.generateMenu = function (hashmap) {
        // Form iniziale con Nome, Tavolo e Quanti siete
        var html = '<div class="form-ordine" style="padding: 10px; background: #333; border-radius: 8px; margin-bottom: 15px;">' +
                   '<label for="nomecliente">Nome:</label>' +
                   '<input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">' +
                   '<label for="tavolo">Tavolo:</label>' +
                   '<input type="text" id="tavolo" placeholder="Numero tavolo">' +
                   '<label for="coperti">Quanti siete?:</label>' +
                   '<input type="number" id="coperti" placeholder="Numero persone" min="1">' +
                   '</div>';

        elencoPrincipale.forEach(function(cat) {
            var articoli = elencoPietanze[cat] || [];
            html += '<div data-role="collapsible"><h4>' + cat + '</h4>';
            
            articoli.forEach(function(p) {
                var id = String(p.ID); // ID del record menuweb
                var nome = p.descrizione || "";
                var prezzo = Number(p.prezzo) || 0;
                var qta = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += '<div class="content-pietanza-ordine" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">' +
                        '<div style="flex: 2;">' + nome + '</div>' +
                        '<div style="flex: 1; text-align: center;">' + prezzo.toFixed(2) + ' €</div>' +
                        '<div style="flex: 1; display: flex; align-items: center; justify-content: flex-end;">' +
                        '<button class="minus-btn ui-btn ui-btn-inline ui-corner-all" id="minus' + id + '">−</button>' +
                        '<span id="quantita' + id + '" style="margin: 0 10px;">' + qta + '</span>' +
                        '<button class="plus-btn ui-btn ui-btn-inline ui-corner-all" id="plus' + id + '">+</button>' +
                        '</div></div>';
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
            $("#quantita" + id).text(q);
            dataManager.saveInstanceHashmap(hashmap);
        });
    };

    this.popolaResoconto = function () {
        var hashmap = dataManager.getInstanceHashmap();
        var html = "<h3>Riepilogo Dati:</h3>";
        html += "<p><b>Nome:</b> " + $("#nomecliente").val() + "</p>";
        html += "<p><b>Tavolo:</b> " + $("#tavolo").val() + "</p>";
        html += "<p><b>Persone:</b> " + $("#coperti").val() + "</p><hr>";

        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) { return hashmap.contains(String(p.ID)); });
            if (articoli.length > 0) {
                html += '<h4>' + cat + '</h4>';
                articoli.forEach(function(p) {
                    html += '<p>' + p.descrizione + ' x ' + hashmap.get(String(p.ID)) + '</p>';
                });
            }
        });
        $("#resoconto").html(html);
    };

    this.popolaQRCode = function () {
        $("#qrcode").empty();
        var testoCodificato = qrcodeManager.generaTestoOrdine();
        var qrCode = new QRCodeStyling({
            width: 250,
            height: 250,
            data: testoCodificato,
            dotsOptions: { color: "#43b261", type: "rounded" },
            cornersSquareOptions: { color: "#178435", type: "extra-rounded" }
        });
        qrCode.append(document.getElementById("qrcode"));
    };
}
var graphicManager = new GraphicManager();
