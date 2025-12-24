// ======================================================================
// VARIABILI MENU
// ======================================================================
var elencoPrincipale = [];
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

        success: function (data) {

            const map = {};

            data.forEach(r => {
                if (!r.id || !r.CAT) return;

                const cat = String(r.CAT).trim();
                r.id = parseInt(r.id, 10);
                r.prezzo = parseFloat(String(r.prezzo).replace(",", ".")) || 0;

                if (!map[cat]) map[cat] = [];
                map[cat].push(r);
            });

            elencoPrincipale = Object.keys(map);
            elencoPietanze = map;

            console.log("✔ Menu caricato:", elencoPrincipale);

            avviaApplicazione();
        }
    });
}

popolaMenuDaCSV();


// ======================================================================
// CLASSE DATA (🔥 ADATTATA AL TUO HASHMAP)
// ======================================================================
function Data() {

    // --------------------------------------------------
    // LEGGE HASHMAP DAL COOKIE
    // --------------------------------------------------
    this.getInstanceHashmap = function () {

        const saved = $.cookie("hashmap");
        const map = new HashMap();

        if (!saved) return map;

        try {
            const obj = JSON.parse(saved);
            for (let k in obj) {
                map.put(parseInt(k), obj[k]);
            }
        } catch (e) {
            console.error("Errore cookie hashmap:", e);
        }

        return map;
    };

    // --------------------------------------------------
    // SALVA HASHMAP NEL COOKIE
    // --------------------------------------------------
    this.saveInstanceHashmap = function (map) {

        const obj = {};
        map.keys().forEach(k => {
            obj[k] = map.get(k);
        });

        $.cookie("hashmap", JSON.stringify(obj), { expires: 1 });
    };

    this.getInstanceCoperti = function () {
        return $.cookie("coperti") || "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}
