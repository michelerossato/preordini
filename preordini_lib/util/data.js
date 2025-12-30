var elencoPrincipale = [];
var categorie = [];
var elencoPietanze = {};

function popolaMenuDaCSV() {
    const API_URL = "https://script.google.com/macros/s/AKfycbxxc7r_TmQwX37jNrp34oB85JjeUNWUj74lvLUfXFRhpeIY8hG5RxaZe8opLZJJ6HU_wQ/exec";

    $.ajax({
        url: API_URL,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback",
        success: function (data) {
            const raw = data.filter(r => r.id && String(r.CAT).trim());
            const categorieMap = {};

            raw.forEach(r => {
                const cat = String(r.CAT).trim();
                if (!categorieMap[cat]) {
                    categorieMap[cat] = { descrizione: cat, articoli: [] };
                }
                r.id = parseInt(r.id, 10) || 0;
                r.prezzo = parseFloat(String(r.prezzo).replace(",", ".")) || 0;
                r.nome = r.descrizione;
                categorieMap[cat].articoli.push(r);
            });

            categorie = Object.values(categorieMap);
            elencoPrincipale = categorie.map(c => c.descrizione);
            elencoPietanze = {};
            categorie.forEach(c => elencoPietanze[c.descrizione] = c.articoli);

            if (typeof avviaApplicazione === "function") avviaApplicazione();
        }
    });
}

popolaMenuDaCSV();

function Data() {
    this.getInstanceHashmap = function () {
        var saved = $.cookie("hashmap");
        if (!saved) return new HashMap();
        try { return HashMap.fromObject(JSON.parse(saved)); } catch (e) { return new HashMap(); }
    };
    this.saveInstanceHashmap = function (map) {
        $.cookie("hashmap", JSON.stringify(map.toObject()), { expires: 1 });
    };
    this.getInstanceCoperti = function () { return $.cookie("coperti") || ""; };
    this.saveInstanceCoperti = function (v) { $.cookie("coperti", v, { expires: 1 }); };
}
