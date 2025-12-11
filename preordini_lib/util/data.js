// ======================================================================
//  VARIABILI GLOBALI PER MENU
// ======================================================================
var elencoPrincipale = [];   // Contiene i nomi delle categorie
var categorie = [];          // Contiene gli oggetti categoria completi
var elencoPietanze = {};     // Mappa categoria -> lista articoli


// ======================================================================
//  CARICAMENTO JSONP DA APPS SCRIPT (SOLUZIONE CORS)
// ======================================================================
function popolaMenuDaCSV() { 
    
    // ⭐️ URL API CORRETTO FORNITO DALL'UTENTE (DEVE FINIRE CON /exec) ⭐️
    const API_URL = "https://script.google.com/macros/s/AKfycbyxgAC0Xd9XybJW7ezAVomR467eMUNjTMtC5btBJnjaSusO0e23pAaYFJz4TU3iOtmSHw/exec"; 

    // USO DI JQUERY AJAX CON JSONP PER SUPERARE IL BLOCCO CORS
    $.ajax({
        url: API_URL,
        dataType: 'jsonp', // ESSENZIALE per aggirare il blocco CORS
        
        success: function (data) {

            console.log("✔ Dati API scaricati via JSONP. Righe:", data.length);

            const categorieMap = {};

            // Filtra le righe che hanno un ID e una categoria valida
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

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Qui vedrai messaggi di errore se lo script Apps Script non risponde o è disabilitato
            console.error("❌ Errore durante il caricamento JSONP:", textStatus, errorThrown);
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
            // Assumiamo che HashMap.fromObject e HashMap.toObject siano definiti in hashmap.js
            return typeof HashMap.fromObject === "function" ? HashMap.fromObject(obj) : new HashMap();
        } catch (e) {
            console.error("Errore lettura cookie hashmap:", e);
            return new HashMap();
        }
    };

    this.saveInstanceHashmap = function (hashmap) {
        if (typeof hashmap.toObject === "function") {
            $.cookie("hashmap", JSON.stringify(hashmap.toObject()), { expires: 1 });
        }
    };

    // COPERTI
    this.getInstanceCoperti = function () {
        var c = $.cookie("coperti");
        return c ? c : "";
