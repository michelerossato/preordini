// ======================================================================
//  VARIABILI GLOBALI PER MENU
// ======================================================================
var elencoPrincipale = [];
var categorie = [];
var elencoPietanze = {};


// ======================================================================
//  CARICAMENTO JSONP DA APPS SCRIPT
// ======================================================================
function popolaMenuDaCSV() {

    const API_URL = "https://script.google.com/macros/s/AKfycbxxc7r_TmQwX37jNrp34oB85JjeUNWUj74lvLUfXFRhpeIY8hG5RxaZe8opLZJJ6HU_wQ/exec";

    $.ajax({
        url: API_URL,
        dataType: "jsonp",
        jsonp: "callback",

        success: function (data) {

            console.log("✔ Dati API caricati:", data);

            const raw = data.filter(r => r.id && String(r.CAT).trim());
            const categorieMap = {};

            raw.forEach(r => {
                const cat = String(r.CAT).trim();

                if (!categorieMap[cat]) {
                    categorieMap[cat] = [];
                }

                r.id = String(r.id); // 🔥 ID STRINGA
                r.prezzo = parseFloat(String(r.prezzo).replace(",", ".")) || 0;
                r.descrizione = r.descrizione || r.nome || "";

                categorieMap[cat].push(r);
            });

            elencoPrincipale = Object.keys(categorieMap);
            elencoPietanze = categorieMap;

            console.log("✔ Menu caricato con successo:", elencoPrincipale);

            if (typeof avviaApplicazione === "function") {
                avviaApplicazione();
            }
        },

        error: function (xhr, status, error) {
            console.error("❌ Errore JSONP:", status, error);
        }
    });
}

popolaMenuDaCSV();


// ======================================================================
//  CLASSE DATA (SENZA fromObject)
// ======================================================================
function Data() {

    this.getInstanceHashmap = function () {

        const saved = $.cookie("hashmap");
        const map = new HashMap();

        if (!saved) return map;

        try {
            const obj = JSON.parse(saved);
            Object.keys(obj).forEach(k => {
                map.put(String(k), obj[k]);
            });
        } catch (e) {
            console.error("Errore lettura cookie hashmap:", e);
        }

        return map;
    };

    this.saveInstanceHashmap = function (map) {
        $.cookie("hashmap", JSON.stringify(map.map), { expires: 1 });
    };

    this.getInstanceCoperti = functio
