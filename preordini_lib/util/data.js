// ======================================================================
// VARIABILI GLOBALI MENU
// ======================================================================
var elencoPrincipale = [];
var categorie = [];
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
        jsonpCallback: "callback",

        success: function (data) {

            console.log("✔ Dati API caricati:", data);

            const raw = data.filter(r => r.id && r.CAT);

            const categorieMap = {};

            raw.forEach(r => {

                const cat = String(r.CAT).trim();

                if (!categorieMap[cat]) {
                    categorieMap[cat] = {
                        descrizione: cat,
                        articoli: []
                    };
                }

                r.id = String(r.id); // 🔥 ID SEMPRE STRINGA
                r.prezzo = parseFloat(String(r.prezzo).replace(",", ".")) || 0;
                r.descrizione = r.descrizione || r.nome || "";

                categorieMap[cat].articoli.push(r);
            });

            categorie = Object.values(categorieMap);
            elencoPrincipale = categorie.map(c => c.descrizione);

            elencoPietanze = {};
            categorie.forEach(c => {
                elencoPietanze[c.descrizione] = c.articoli;
            });

            console.log("✔ Menu caricato con successo:", elencoPrincipale);

            if (typeof avviaApplicazione === "function") {
                avviaApplicazione();
            }
        },

        error: function (xhr, status, error) {
            console.error("❌ Errore caricamento menu:", status, error);
        }
    });
}

popolaMenuDaCSV();


// ======================================================================
// CLASSE DATA (ROBUSTA)
// ======================================================================
function Data() {

    // -----------------------------
    // HASHMAP
    // -----------------------------
    this.getInstanceHashmap = function () {

        const saved = $.cookie("hashmap");
        if (!saved) return new HashMap();

        try {
            const obj = JSON.parse(saved);
            return HashMap.fromObject(obj);
        } catch (e) {
            console.error("Errore lettura cookie hashmap:", e);
            return new HashMap();
        }
    };

    this.saveInstanceHashmap = function (map) {

        let obj = {};

        // ✅ accetta HashMap
        if (map && typeof map.toObject === "function") {
            obj = map.toObject();
        }
        // ✅ accetta oggetto semplice
        else if (typeof map === "object") {
            obj = map;
        }

        $.cookie("hashmap", JSON.stringify(obj), { expires: 1 });
    };

    // -----------------------------
    // COPERTI
    // -----------------------------
    this.getInstanceCoperti = function () {
        return $.cookie("coperti") || "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}
