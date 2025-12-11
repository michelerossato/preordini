// ======================================================================
//  VARIABILI GLOBALI PER MENU
// ======================================================================
var elencoPrincipale = [];   // Contiene i nomi delle categorie
var categorie = [];          // Contiene gli oggetti categoria completi
var elencoPietanze = {};     // Mappa categoria -> lista articoli


// ======================================================================
//  CARICAMENTO JSON DA APPS SCRIPT
// ======================================================================
function popolaMenuDaCSV() { 
    
    // ⭐️ URL API CORRETTO - FINISCE CON /exec ⭐️
    const API_URL = "https://script.google.com/macros/s/AKfycby9B-MDKydgFn1SLg_VIQGRFnxiKC70UbSb9RdN4f4zInDB7aGfkVaeCxam4jjrjmmt8A/exec"; 

    // Usiamo fetch() per scaricare i dati JSON
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                // Se c'è un errore HTTP (es. 404, 500)
                throw new Error(`Errore HTTP! Stato: ${response.status}`);
            }
            return response.json(); // Analizza la risposta come JSON
        })
        .then(data => {
            
            console.log("✔ Dati API scaricati. Righe:", data.length);

            const categorieMap = {};

            // Filtriamo le righe che hanno un ID e una categoria valida
            const raw = data.filter(r => r.id && String(r.CAT).trim());

            if (raw.length === 0) {
                console.error("❌ Nessun dato valido trovato nell'API.");
                return;
            }

            raw.forEach(r => {
                const cat = String(r.CAT).trim();

                if (!categorieMap[cat]) {
                    categorieMap[cat] = {
                        descrizione: cat,
                        articoli: []
                    };
                }

                // Conversione e pulizia dei dati
                r.id = parseInt(String(r.id), 10) || 0;
                // Sostituzione virgola con punto per la corretta lettura del decimale
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

            // Avvia il resto dell'applicazione (definito in main.js)
            if (typeof avviaApplicazione === "function") {
                avviaApplicazione();
            }

        })
        .catch(err => {
            console.error("❌ Errore durante il caricamento API:", err);
            // Non chiamare avviaApplicazione() in caso di errore
        });
}

popolaMenuDaCSV();


// ======================================================================
//  CLASSE DATA — GESTIONE COOKIE E STORAGE
// ======================================================================
function Data() {
    // ... (Il resto della classe Data che gestisce i cookie)
    this.getInstanceHashmap = function () {
        var saved = $.cookie("hashmap");
        if (!saved) {
            return new HashMap();
        }
        try {
            var obj = JSON.parse(saved);
            // Questa riga dipende dal tuo file hashmap.js. Ho assunto che esista la funzione fromObject.
            return typeof HashMap.fromObject === "function" ? HashMap.fromObject(obj) : new HashMap();
        } catch (e) {
            console.error("Errore lettura cookie hashmap:", e);
            return new HashMap();
        }
    };

    this.saveInstanceHashmap = function (hashmap) {
        // Questa riga dipende dal tuo file hashmap.js. Ho assunto che esista la funzione toObject.
        if (typeof hashmap.toObject === "function") {
            $.cookie("hashmap", JSON.stringify(hashmap.toObject()), { expires: 1 });
        }
    };

    this.getInstanceCoperti = function () {
        var c = $.cookie("coperti");
        return c ? c : "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}
