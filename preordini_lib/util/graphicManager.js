function GraphicManager() {

    // ======================================================================
    // GENERA MENU PRINCIPALE
    // ======================================================================
    this.generateMenu = function (hashmap) {

        function generatePietanza(id, nome, prezzo, quantita) {
            return "<div class='content-pietanza-ordine'>" +
                "<div class='left nome-pietanza'>" +
                nome +
                "</div>" +
                "<div class='center prezzo-pietanza-ordine'>" +
                setTextPrezzo(prezzo) +
                "</div>" +
                "<div class='right'>" +
                "<div class='left minus'>" +
                "<button data-mini='false' data-inline='true' class='ui-btn brown-btn minus-btn' id='minus" + id + "'>-</button>" +
