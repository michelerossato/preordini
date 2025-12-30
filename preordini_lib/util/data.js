var elencoPrincipale = [];
var elencoPietanze = {};

function DataManager() {
    this.caricaDati = function() {
        var urlWebApp = "https://script.google.com/macros/s/AKfycbxxc7r_TmQwX37jNrp34oB85JjeUNWUj74lvLUfXFRhpeIY8hG5RxaZe8opLZJJ6HU_wQ/exec";

        console.log("Tentativo caricamento JSONP da Google...");

        $.ajax({
            url: urlWebApp,
            dataType: "jsonp",
            jsonpCallback: "callback", // Obbligatorio perché il tuo script risponde con 'callback(...)'
            success: function(data) {
                console.log("Dati ricevuti con successo:", data);
                
                // Reset per evitare duplicati
                elencoPrincipale = [];
                elencoPietanze = {};

                data.forEach(function(riga) {
                    var categoria = riga.CAT; 
                    var pietanza = {
                        ID: riga.id,
                        descrizione: riga.descrizione,
                        prezzo: riga.prezzo
                    };

                    if (!elencoPietanze[categoria]) {
                        elencoPietanze[categoria] = [];
                        elencoPrincipale.push(categoria);
                    }
                    elencoPietanze[categoria].push(pietanza);
                });

                $(document).trigger("datiPronti");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Errore AJAX:", textStatus, errorThrown);
                alert("Errore nel caricamento del menù da Google. Verifica la connessione.");
            }
        });
    };

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
