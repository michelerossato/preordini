function GraphicManager() {
    this.generateMenu = function (hashmap) {
        // Form superiore con i 3 campi richiesti
        var html = '<div class="form-ordine" style="padding:15px; background:#222; border-radius:10px; margin-bottom:20px;">' +
                   '<input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">' +
                   '<input type="text" id="tavolo" placeholder="Numero tavolo">' +
                   '<input type="number" id="coperti" placeholder="Quanti siete?" min="1">' +
                   '</div>';

        elencoPrincipale.forEach(function(cat) {
            var articoli = elencoPietanze[cat] || [];
            html += '<div data-role="collapsible"><h4>' + cat + '</h4>';
            
            articoli.forEach(function(p) {
                var id = String(p.ID);
                var nome = p.descrizione || "";
                var prezzo = Number(p.prezzo) || 0;
                var qta = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += '<div class="content-pietanza-ordine" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
                        '<div style="width:50%">' + nome + '</div>' +
                        '<div style="width:20%">' + prezzo.toFixed(2) + ' €</div>' +
                        '<div style="width:35%; text-align:right;">' +
                        '<button class="minus-btn ui-btn ui-btn-inline" id="minus' + id + '">−</button>' +
                        '<span id="quantita' + id + '" style="margin:0 5px;">' + qta + '</span>' +
                        '<button class="plus-btn ui-btn ui-btn-inline" id="plus' + id + '">+</button>' +
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
        var html = "<h3>Riepilogo Ordine</h3>";
        html += "<p><b>Cliente:</b> " + $("#nomecliente").val() + "<br><b>Tavolo:</b> " + $("#tavolo").val() + "<br><b>Persone:</b> " + $("#coperti").val() + "</p><hr>";

        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) { return hashmap.contains(String(p.ID)); });
            if (articoli.length > 0) {
                html += '<b>' + cat + '</b>';
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
            width: 300,
            height: 300,
            data: testoCodificato,
            dotsOptions: { color: "#43b261", type: "rounded" },
            cornersSquareOptions: { color: "#178435", type: "extra-rounded" }
        });
        qrCode.append(document.getElementById("qrcode"));
    };
}
