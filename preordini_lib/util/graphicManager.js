function GraphicManager() {

    // ============================================================
    //  GENERA MENU PRINCIPALE CON CATEGORIE + PIETANZE + LINK DOC
    // ============================================================
    this.generateMenu = function(hashmap){

        function generatePietanza(id, nome, prezzo, quantita){
            return "<div class='content-pietanza-ordine'>" +
                "<div class='left nome-pietanza'>" +
                    nome +
                "</div>" +
                "<div class='center prezzo-pietanza-ordine'>" +
                    setTextPrezzo(prezzo) +
                "</div>" +
                "<div class='right'>" +
                    "<div class='left minus'>" +
                        "<button class='ui-btn brown-btn minus-btn' id='minus" + id + "'>-</button>" +
                    "</div>" +
                    "<div class='center quantita-pietanza-ordine'>" +
                        "<span id='quantita" + id + "'>" + quantita + "</span>" +
                    "</div>" +
                    "<div class='right plus'>" +
                        "<button class='ui-btn brown-btn plus-btn' id='plus" + id + "'>+</button>" +
                    "</div>" +
                "</div>" +
                "<div class='endBlock'></div>" +
            "</div>";
        }

        // ==============================
        //  Campi cliente
        // ==============================
        var txtLista =
            "<div>" +
                "<input type='text' id='nomecliente' placeholder='Inserisci il tuo nome'/>" +
                "<input type='text' id='tavolo' placeholder='Inserisci il numero del tavolo'/>" +
                "<input type='text' id='coperti' placeholder='Quanti siete?'/>" +
            "</div>";

        // ==============================
        //  🔥 Link Documento Google
        // ==============================
        txtLista +=
            "<div style='margin: 15px 0; text-align:center;'>" +
                "<a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vRIyRtTRCMqUH_qI4knGCE-llpqNvfKXW9xEFpa6R4unSNXqlt0zbEThuvy6ugnGTgZl_BNX067D9uy/pub?gid=0&single=true&output=csv'" +
                " target='_blank' class='ui-btn ui-btn-b ui-corner-all ui-shadow'>" +
                "📄 Apri Documento Google" +
                "</a>" +
            "</div>";

        // ==============================
        //  MENU CATEGORIE DAL CSV
        // ==============================
        for (var i = 0; i < elencoPrincipale.length; i++) {

            var categoriaNome = elencoPrincipale[i];
            var pietanze = elencoPietanze[categoriaNome];

            txtLista += "<div data-role='collapsible'>" +
                        "<h4>" + categoriaNome + "</h4>";

            for (var j = 0; j < pietanze.length; j++) {

                var p = pietanze[j];
                p.nome = p.descrizione;

                var quantita = hashmap.contains(p.id)
                    ? hashmap.get(p.id)
                    : 0;

                txtLista += generatePietanza(p.id, p.nome, p.prezzo, quantita);
            }

            txtLista += "</div>";
        }

        return txtLista;
    };

    // ============================================================
    //  GESTIONE PULSANTI + / -
    // ============================================================
    this.setButtonPlusMinus = function(hashmap){
        var dataManager = new Data();

        for (var i = 0; i < elencoPrincipale.length; i++) {
            var pietanze = elencoPietanze[elencoPrincipale[i]];

            for (var j = 0; j < pietanze.length; j++) {

                var p = pietanze[j];

                $("#plus" + p.id).off().click(function(){
                    var id = this.id.substring("plus".length);
                    var qHtml = $("#quantita" + id);
                    var q = parseInt(qHtml.html()) + 1;
                    qHtml.html(q);

                    var hm = dataManager.getInstanceHashmap();
                    hm.put(id, q);
                    dataManager.saveInstanceHashmap(hm);
                });

                $("#minus" + p.id).off().click(function(){
                    var id = this.id.substring("minus".length);
                    var qHtml = $("#quantita" + id);
                    var q = Math.max(parseInt(qHtml.html()) - 1, 0);
                    qHtml.html(q);

                    var hm = dataManager.getInstanceHashmap();
                    if(q > 0) hm.put(id, q);
                    else hm.remove(id);

                    dataManager.saveInstanceHashmap(hm);
                });

            }
        }
    };

    // ============================================================
    //  POPUP
    // ============================================================
    this.generatePopup = function(id, dataElimina){

        var title, info;

        if(dataElimina.value){
            title = "Elimina Ordine";
            if(dataElimina.state == 0){
                info = "<p>Nessuna pietanza selezionata.</p><p>Seleziona almeno una pietanza.</p>";
            } else {
                info = "<p>Ordine eliminato.</p><p>Tutte le quantità sono state azzerate.</p>";
            }
        } else {
            title = "Ordine Vuoto";
            info = "<p>Il tuo ordine è vuoto.</p><p>Seleziona almeno una pietanza.</p>" +
                   "<button class='ui-btn green-btn' id='ordine-vuoto-btn'>Ok</button>";
        }

        $("#title-popup").html(title);
        $("#info-ordine-popup").html(info);

        if(!dataElimina.value){
            $("#ordine-vuoto-btn").click(function(){
                $(id).popup("close");
            });
        }
    };

    // ============================================================
    //  RESOCONTO
    // ============================================================
    this.popolaResoconto = function(){

        var hashmap = dataManager.getInstanceHashmap();
        var keys = hashmap.keys();
        var totale = 0;
        var html = "";

        function getPietanzaById(id){
            for (var i = 0; i < elencoPrincipale.length; i++){
                var arr = elencoPietanze[elencoPrincipale[i]];
                for (var j = 0; j < arr.length; j++)
                    if(arr[j].id == id) return arr[j];
            }
            return null;
        }

        for(var i = 0; i < keys.length; i++){

            var id = keys[i];
            var quantita = hashmap.get(id);
            var p = getPietanzaById(id);

            if(p){
                var subtot = p.prezzo * quantita;

                html += "<div class='item-resoconto'>" +
                        "<span>" + p.descrizione + "</span> x " + quantita +
                        "<span class='prezzo'>" + setTextPrezzo(subtot) + "</span>" +
                        "</div>";

                totale += subtot;
            }
        }

        $("#resoconto-lista").html(html);
        $("#resoconto-totale").html(setTextPrezzo(totale));
    };

    // ============================================================
    //  QR CODE
    // ============================================================
    this.popolaQRCode = function(){

        var hashmap = dataManager.getInstanceHashmap();
        var datiMin = hashmap.toArray();
        var json = JSON.stringify(datiMin);

        $("#qrcode").html("");

        new QRCode(document.getElementById("qrcode"), {
            text: json,
            width: 256,
            height: 256
        });
    };

    // ============================================================
    //  FORMATAZIONE PREZZO
    // ============================================================
    function setTextPrezzo(prezzo){
        if(prezzo % 1 === 0) return prezzo + ",00 Euro";
        return prezzo.toFixed(2).replace(".", ",") + " Euro";
    }
}
