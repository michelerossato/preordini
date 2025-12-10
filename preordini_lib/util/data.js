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

    // ✅ URL CSV CORRETTO
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

                // Nome ufficiale
                r.nome = r.descrizione;

                categorieMap[cat].articoli.push(r);
            });

            // Convertiamo la MAP in array
            categorie = Object.values(categorieMap);

            // Popoliamo le variabili globali
            elencoPrincipale = categorie.map(c => c.descrizione);

            elencoPietanze = {};
            categorie.forEach(c => {
                elencoPietanze[c.descrizione] = c.articoli;
            });

            console.log("✔ Menu caricato con successo:", elencoPrincipale);

            // Avvio app solo dopo caricamento dati
            if (typeof avviaApplicazione === "function") {
                avviaApplicazione();
            }
        },

        error: function (err) {
            console.error("❌ Errore durante il caricamento CSV:", err);
        }
    });
}

// Avviamo il caricamento
popolaMenuDaCSV();


// ======================================================================
//  CLASSE DATA (COOKIE E STORAGE)
// ===========================
