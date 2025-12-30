var elencoPrincipale = [];
var elencoPietanze = {};

function DataManager() {
    this.caricaDati = function() {
        var self = this;
        // Sostituisci questo URL con il link al tuo file CSV/API
        $.get("preordini_lib/util/menu.csv", function(data) {
            // Logica di parsing del CSV (semplificata)
            // Assicurati che qui vengano popolati elencoPrincipale e elencoPietanze
            console.log("Dati API caricati");
            
            // Una volta finito il caricamento, avvisa il sistema
            $(document).trigger("datiPronti");
        });
    };

    this.saveInstanceHashmap = function(hashmap) {
        var str = "";
        hashmap.keys().forEach(function(key) {
            str += key + ":" + hashmap.get(key) + ";";
        });
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
// Avvia il caricamento dei dati
dataManager.caricaDati();
