// ======================================================================
// VARIABILI GLOBALI MENU
// ======================================================================
var elencoPrincipale = [];
var elencoPietanze = {};


// ======================================================================
// CARICAMENTO MENU DA GOOGLE APPS SCRIPT (JSONP)
// ======================================================================
function popolaMenuDaCSV() {

    const API_URL = "https://script.google.com/macros/s/AKfycbxxc7r_TmQwX37jNrp34oB85JjeUNWUj74lvLUfXFRhpeIY8hG5RxaZe8opLZJJ6HU_wQ/exec";

    $.ajax({
        url: API_URL,
        dataType: "jsonp",
        jsonp: "callback",

        success: function (data) {

            console.log("✔ Dati API caricati:", data);

            const categorieMap = {};

            data.forEach(r => {
                if (!r.id || !r.CAT) return;

                const cat = String(r.CAT).trim();
                const id = String(r.id).trim();

                if (!categorieMap[cat]) categorieMap[cat] = [];

                categorieMap[cat].push({
                    id: id,
                    descrizione: r.descrizione,
                    prezzo: Number(String(r.prezzo).replace(",", ".")) || 0
                });
            });

            elencoPrincipale = Object.keys(categorieMap);
            elencoPietanze = categorieMap;

            console.log("✔ Menu caricato con successo:", elencoPrincipale);

            avviaApplicazione();
        },

        error: function (e) {
            console.error("❌ Errore caricamento menu", e);
        }
    });
}

popolaMenuDaCSV();


// ======================================================================
// CLASSE DATA (COMPATIBILE CON HashMap.js)
// ======================================================================
function Data() {

    // -------- HASHMAP --------
    this.getInstanceHashmap = function () {

        const saved = $.cookie("hashmap");
        const map = new HashMap();

        if (!saved) return map;

        try {
            const obj = JSON.parse(saved);
            for (let k in obj) {
                map.put(k, obj[k]);
            }
        } catch (e) {
            console.error("Errore cookie hashmap", e);
        }

        return map;
    };

    this.saveInstanceHashmap = function (map) {

        const obj = {};

        const keys = map.keys();
        for (let i = 0; i < keys.length; i++) {
            obj[keys[i]] = map.get(keys[i]);
        }

        $.cookie("hashmap", JSON.stringify(obj), { expires: 1 });
    };

    // -------- COPERTI --------
    this.getInstanceCoperti = function () {
        return $.cookie("coperti") || "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}
