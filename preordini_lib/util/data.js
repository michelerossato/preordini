function popolaMenuDaCSV() {

    const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIyRtTRCMqUH_qI4knGCE-llpqNvfKXW9xEFpa6R4unSNXqlt0zbEThuvy6ugnGTgZl_BNX067D9uy/pub?gid=0&single=true&output=csv";

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function (results) {

            const raw = results.data.filter(row => row.id && row.CAT);

            const categorieMap = {};

            raw.forEach(r => {
                const cat = r.CAT;

                if (!categorieMap[cat]) {
                    categorieMap[cat] = {
                        descrizione: cat,
                        articoli: []
                    };
                }

                r.id = parseInt(r.id, 10);
                r.prezzo = parseFloat(String(r.prezzo).replace(",", ".")) || 0;

                categorieMap[cat].articoli.push(r);
            });

            // ARRAY finale categorie
            categories = Object.values(categorieMap);

            // POPOLA LE GLOBALI
            elencoPrincipale = categories.map(c => c.descrizione);

            elencoPietanze = {};
            categories.forEach(c => {
                elencoPietanze[c.descrizione] = c.articoli;
            });

            console.log("✔ Menu caricato da Google Sheet");

            if (typeof avviaApplicazione === "function") {
                avviaApplicazione();
            }
        },
        error: function (err) {
            console.error("Errore nel caricamento CSV:", err);
        }
    });
}

popolaMenuDaCSV();
