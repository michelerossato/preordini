// ======================================================================
//  GRAPHIC MANAGER
// ======================================================================

function GraphicManager() {

    // --------------------------------------------------------------
    // GENERA MENU
    // --------------------------------------------------------------
    this.generateMenu = function (hashmap) {

        function generatePietanza(id, nome, prezzo, quantita) {
            return "<li class='pietanza' id='pietanza-" + id + "'>" +
                "<a href='#' class='pietanza-link'>" + nome +
                "<span class='ui-li-count'>" + prezzo + "€</span>" +
                "</a>" +
                "<fieldset data-role='controlgroup' data-type='horizontal' class='quantita-group'>" +
                "<button class='minus-btn' data-id='" + id + "'>-</button>" +
                "<input type='text' class='quantita' id='quantita-" + id + "' value='" + quantita + "' readonly/>" +
                "<button class='plus-btn' data-id='" + id + "'>+</button>" +
                "</fieldset>" +
                "</li>";
        }

        var txtLista =
            "<div>" +
            "<input ty
