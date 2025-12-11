// ======================================================================
//  VARIABILI GLOBALI PER MENU
// ======================================================================
var elencoPrincipale = [];   // Contiene i nomi delle categorie
var categorie = [];          // Contiene gli oggetti categoria completi
var elencoPietanze = {};     // Mappa categoria -> lista articoli


// ======================================================================
//  CARICAMENTO CSV DA GOOGLE SHEET
// ======================================================================
function popolaMenuDaCSV() {

    // URL CSV
    const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIyRtTRCMqUH_qI4knGCE-llpqNvfKXW9xEFpa6R4unSNXqlt0zbEThuvy6ugnGTgZl_BNX067D9uy/pub?gid=0&single=true&output=csv";

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function (results) {

            console.log("✔ CSV scaricato. Righe:", results.data.length);

            // Rimuove righe vuote o non valide
            const raw = results.data.filter(r => r.id && r.CAT);

            if (raw.length === 0) {
                console.error("❌ Nessun dato valido trovato nel CSV.");
                return;
            }

            const categorieMap = {};

            raw.forEach(r => {
                const cat = r.CAT.trim();

                if (!categorieMap[cat]) {
                    categorieMap[cat] = {
                        descrizione: cat,
                        articoli: []
                    };
                }

                // Conversioni numeriche
                r.id = parseInt(r.id, 10);
                r.prezzo = parseFloat(String(r.prezzo).replace(",", ".")) || 0;

                r.nome = r.descrizione;

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

        error: function (err) {
            console.error("❌ Errore durante il caricamento CSV:", err);
        }
    });
}

popolaMenuDaCSV();


// ======================================================================
//  CLASSE DATA — GESTIONE COOKIE E STORAGE
// ======================================================================
function Data() {

    // Recupera HASHMAP da cookie o crea nuovo
    this.getInstanceHashmap = function () {
        var saved = $.cookie("hashmap");
        if (!saved) {
            return new HashMap();
        }
        try {
            var obj = JSON.parse(saved);
            return HashMap.fromObject(obj);
        } catch (e) {
            console.error("Errore lettura cookie hashmap:", e);
            return new HashMap();
        }
    };

    this.saveInstanceHashmap = function (hashmap) {
        $.cookie("hashmap", JSON.stringify(hashmap.toObject()), { expires: 1 });
    };

    // COPERTI
    this.getInstanceCoperti = function () {
        var c = $.cookie("coperti");
        return c ? c : "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}

