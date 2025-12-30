var elencoPrincipale = [];
var elencoPietanze = {};

function DataManager() {
    this.caricaDati = function() {
        var urlWebApp = "https://script.google.com/macros/s/AKfycbxxc7r_TmQwX37jNrp34oB85JjeUNWUj74lvLUfXFRhpeIY8hG5RxaZe8opLZJJ6HU_wQ/exec?callback=?";

        console.log("Caricamento dati tramite JSONP...");

        $.ajax({
            url: urlWebApp,
            dataType: 'jsonp', // Indica a jQuery di aspettarsi il formato 'callback(...)'
            success: function(data) {
                // Pulizia liste per evitare duplicati in caso di refresh
                elencoPrincipale = [];
                elencoPietanze = {};

                data.forEach(function(riga) {
                    var categoria = riga.CAT; // Usa 'CAT' come nel tuo file
                    var pietanza = {
                        ID: riga.id,          // Usa 'id' come nel tuo file
                        descrizione: riga.descrizione,
                        prezzo: riga.prezzo
                    };

                    if (!elencoPietanze[categoria]) {
                        elencoPietanze[categoria] = [];
                        elencoPrincipale.push(categoria);
                    }
                    elencoPietanze[categoria].push(pietanza);
                });

                console.log("Dati caricati correttamente. Categorie trovate:", elencoPrincipale);
                $(document).trigger("datiPronti");
            },
            error: function(e) {
                console.error("Errore nel caricamento JSONP:", e);
                alert("Impossibile caricare il menu. Controlla la connessione.");
            }
        });
    };

    // Mantieni le funzioni saveInstanceHashmap, getInstanceHashmap e eliminaOrdine identiche a prima
    this.saveInstanceHashmap = function(hashmap) {
        var str = "";
        hashmap.keys().forEach(function(key) { str += key + ":" + hashmap.get(key) + ";"; });
        $.cookie("ordine_hashmap", str, { expires: 1 });
    };

    this.getInstanceHashmap = function() {
        var hashmap = new HashMap();
        var cookie = $.cookie("ordine_hashmap");
        if (cookie) {
            cookie.split(";").forEach(function(item) {
                if (item) {
                    var parts = item.split(":");
                    hashmap.put(parts[0], parseInt(parts[1]));
                }
            });
        }
        return hashmap;
    };

    this.eliminaOrdine = function() {
        $.removeCookie("ordine_hashmap");
        location.reload();
    };
}

var dataManager = new DataManager();
dataManager.caricaDati();
