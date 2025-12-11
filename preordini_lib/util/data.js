// ======================================================================
//  VARIABILI GLOBALI PER MENU
// ======================================================================
var elencoPrincipale = [];   // Contiene i nomi delle categorie
var categorie = [];          // Contiene gli oggetti categoria completi
var elencoPietanze = {};     // Mappa categoria -> lista articoli


// ======================================================================
// NUOVO CODICE - CARICAMENTO JSON DA APPS SCRIPT
// ======================================================================
function popolaMenuDaCSV() { // Manteniamo il nome per compatibilità
    
    // ⭐️ IL TUO NUOVO URL API FUNZIONANTE ⭐️
    const API_URL = "https://script.google.com/macros/s/AKfycby9B-MDKydgFn1SLg_VIQGRFnxiKC70UbSb9RdN4f4zInDB7aGfkVaeCxam4jjrjmmt8A/exec"; 

    // Usiamo fetch() per scaricare i dati JSON
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore HTTP! Stato: ${response.status}`);
            }
            return response.json(); // Analizza la risposta come JSON
        })
        .then(data => {
            
            console.log("✔ Dati API scaricati. Righe:", data.length);

            // 'data' ora è un array di oggetti (JSON)
            // Filtriamo le righe che hanno un ID e una categoria valida
            const raw = data.filter(r => r.id && String(r.CAT).trim());

            if (raw.length === 0) {
                console.error("❌ Nessun dato valido trovato nell'API.");
                return;
            }

            const categorieMap = {};

            raw.forEach(r => {
                const cat = String(r.CAT).trim();

                if (!categorieMap[cat]) {
                    categorieMap[cat] = {
                        descrizione: cat,
                        articoli: []
                    };
                }

                // Conversione numerica (più robusta)
                r.id = parseInt(String(r.id), 10) || 0;
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

        })
        .catch(err => {
            console.error("❌ Errore durante il caricamento API:", err);
        });
}

popolaMenuDaCSV();


// ======================================================================
//  CLASSE DATA — GESTIONE COOKIE E STORAGE (NESSUNA MODIFICA QUI)
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
            // Supponiamo che HashMap.fromObject sia definita altrove (o non necessaria)
            // Se HashMap.fromObject non è definita, prova a usare il costruttore base
            if (typeof HashMap.fromObject === "function") {
                return HashMap.fromObject(obj);
            } else {
                return new HashMap(); // O logica di ricostruzione
            }
        } catch (e) {
            console.error("Errore lettura cookie hashmap:", e);
            return new HashMap();
        }
    };

    this.saveInstanceHashmap = function (hashmap) {
        // Se non hai definito un metodo .toObject() su HashMap, potresti doverlo definire
        // In questo codice, assumiamo che .toObject() sia disponibile
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
