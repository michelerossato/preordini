// ======================================================================
// VARIABILI GLOBALI MENU
// ======================================================================
var elencoPrincipale = [];
var categorie = [];
var elencoPietanze = {};


// ======================================================================
// CARICAMENTO MENU DA GOOGLE SCRIPT (JSONP)
// ======================================================================
function popolaMenuDaCSV() {

    const API_URL = "https://script.google.com/macros/s/AKfycbxxc7r_TmQwX37jNrp34oB85JjeUNWUj74lvLUfXFRhpeIY8hG5RxaZe8opLZJJ6HU_wQ/exec";

    $.ajax({
        url: API_URL,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback",

        success: function (data) {

            const raw = data.filter(r => r.id && String(r.CAT).trim());
            const categorieMap = {};

            raw.forEach(r => {
                const cat = String(r.CAT).trim();

                if (!categorieMap[cat]) {
                    categorieMap[cat] = [];
                }

                categorieMap[cat].push({
                    id: String(r.id),
                    descrizione: r.descrizione,
                    prezzo: parseFloat(String(r.prezzo).replace(",", ".")) || 0
                });
            });

            elencoPrincipale = Object.keys(categorieMap);
            elencoPietanze = categorieMap;

            console.log("✔ Menu caricato:", elencoPrincipale);

            avviaApplicazione();
        },

        error: function () {
            console.error("❌ Errore caricamento menu");
        }
    });
}

popolaMenuDaCSV();


// ======================================================================
// DATA MANAGER (USA SOLO OGGETTI JS)
// ======================================================================
function Data() {

    this.getInstanceOrdine = function () {
        const saved = $.cookie("ordine");
        return saved ? JSON.parse(saved) : {};
    };

    this.saveInstanceOrdine = function (obj) {
        $.cookie("ordine", JSON.stringify(obj), { expires: 1 });
    };

    this.getInstanceCoperti = function () {
        return $.cookie("coperti") || "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}
