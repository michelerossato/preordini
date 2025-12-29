function GraphicManager() {

    // =============================================================
    // GENERA MENU (Pagina Principale)
    // =============================================================
    this.generateMenu = function (hashmap) {
        var html = '<div class="form-ordine">' +
                   '<input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">' +
                   '<input type="text" id="tavolo" placeholder="Numero tavolo">' +
                   '<input type="number" id="coperti" placeholder="Quanti siete?" min="1">' +
                   '</div>';

        elencoPrincipale.forEach(function(cat) {
            var articoli = elencoPietanze[cat] || [];
            html += '<div data-role="collapsible"><h4>' + cat + '</h4>';

            articoli.forEach(function(p) {
                var id = String(p.id);
                var nome = p.descrizione || p.nome || "";
                var prezzo = Number(p.prezzo) || 0;
                var quantita = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += '<div class="content-pietanza-ordine">' +
                        '<div class="left nome-pietanza">' + nome + '</div>' +
                        '<div class="center prezzo-pietanza-ordine">' + prezzo.toFixed(2) + ' €</div>' +
                        '<div class="right controlli">' +
                        '<button class="ui-btn brown-btn minus-btn" id="minus' + id + '">−</button>' +
                        '<span id="quantita' + id + '" class="quantita-pietanza-ordine">' + quantita + '</span>' +
                        '<button class="ui-btn brown-btn plus-btn" id="plus' + id + '">+</button>' +
                        '</div>' +
                        '<div class="endBlock"></div>' +
                        '</div>';
            });
            html += '</div>';
        });

        return html;
    };

    this.setButtonPlusMinus = function (hashmap) {
        $(document).off("click", ".plus-btn").on("click", ".plus-btn", function () {
            var id = $(this).attr("id").replace("plus", "");
            var q = hashmap.contains(id) ? hashmap.get(id) : 0;
            q++;
            hashmap.put(id, q);
            $("#quantita" + id).text(q);
            dataManager.saveInstanceHashmap(hashmap);
        });

        $(document).off("click", ".minus-btn").on("click", ".minus-btn", function () {
            var id = $(this).attr("id").replace("minus", "");
            if (hashmap.contains(id)) {
                var q = hashmap.get(id);
                q--;
                if (q <= 0) {
                    hashmap.remove(id);
                    $("#quantita" + id).text(0);
                } else {
                    hashmap.put(id, q);
                    $("#quantita" + id).text(q);
                }
                dataManager.saveInstanceHashmap(hashmap);
            }
        });
    };

    // =============================================================
    // RESOCONTO (Pagina Riepilogo)
    // =============================================================
    this.popolaResoconto = function () {
        var hashmap = dataManager.getInstanceHashmap();
        var html = "";
        var totale = 0;
        var totaleQta = 0;

        elencoPrincipale.forEach(function(cat) {
            var articoli = (elencoPietanze[cat] || []).filter(function(p) {
                return hashmap.contains(String(p.id));
            });
            if (articoli.length === 0) return;

            html += '<h3 class="categoria-resoconto">' + cat + '</h3>';
            articoli.forEach(function(p) {
                var q = hashmap.get(String(p.id));
                var subtot = q * (Number(p.prezzo) || 0);
                totale += subtot;
                totaleQta += q;

                html += '<div class="content-pietanza-riepilogo">' +
                        '<div class="left nome-pietanza">' + p.descrizione + '</div>' +
                        '<div class="center quantita-pietanza-riepilogo">x' + q + '</div>' +
                        '<div class="right">' + subtot.toFixed(2) + ' €</div>' +
                        '<div class="endBlock"></div>' +
                        '</div>';
            });
        });

        html += '<hr><div class="riga-resoconto totale">' +
                '<div class="left"><strong>Totale</strong></div>' +
                '<div class="center"><strong>' + totaleQta + '</strong></div>' +
                '<div class="right"><strong>' + totale.toFixed(2) + ' €</strong></div>' +
                '<div class="endBlock"></div>' +
                '</div>';

        $("#resoconto").html(html);
    };

    // =============================================================
    // QR CODE MODERNO
    // =============================================================
    this.popolaQRCode = function () {
        $("#qrcode").empty();
        
        try {
            var testoOrdine = qrcodeManager.generaTestoOrdine();

            var qrCode = new QRCodeStyling({
                width: 280,
                height: 280,
                type: "svg",
                data: testoOrdine,
                dotsOptions: {
                    color: "#43b261",
                    type: "rounded"
                },
                backgroundOptions: {
                    color: "#ffffff",
                },
                cornersSquareOptions: {
                    color: "#178435",
                    type: "extra-rounded"
                },
                cornersDotOptions: {
                    color: "#178435",
                    type: "dot"
                },
                qrOptions: {
                    errorCorrectionLevel: "Q"
                }
            });

            qrCode.append(document.getElementById("qrcode"));
        } catch (e) {
            console.error("Errore generazione QR Code Stilizzato. Assicurati che la libreria sia caricata nell'index.", e);
        }
    };

    // =============================================================
    // POPUP
    // =============================================================
    this.generatePopup = function () {
        $("#info-ordine-popup").html(
            '<p>Il tuo ordine è vuoto.</p>' +
            '<button class="ui-btn green-btn" id="ok-popup-btn">OK</button>'
        );
        $("#ok-popup-btn").off().on("click", function() {
            $("#popup-ordine").popup("close");
        });
    };
}
