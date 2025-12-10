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
        "<div> " + 
            "<input type='text' id='nomecliente' placeholder='Inserisci il tuo nome'/>" +
            "<input type='text' id='tavolo' placeholder='Inserisci il numero del tavolo'/>" +
            "<input type='text' id='coperti' placeholder='Quanti siete?'/>" +
        "</div>";

    // ==============================
    //  🔥 Link al documento Google
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
    for(var i = 0; i < elencoPrincipale.length; i++){

        var categoriaNome = elencoPrincipale[i];
        var pietanze = elencoPietanze[categoriaNome];

        txtLista += "<div data-role='collapsible'>" +
                    "<h4>" + categoriaNome + "</h4>";

        for(var j = 0; j < pietanze.length; j++){
            var p = pietanze[j];

            p.nome = p.descrizione;
            var quantita = hashmap.contains(p.id) ? hashmap.get(p.id) : 0;

            txtLista += generatePietanza(p.id, p.nome, p.prezzo, quantita);
        }

        txtLista += "</div>";
    }

    return txtLista;
}
