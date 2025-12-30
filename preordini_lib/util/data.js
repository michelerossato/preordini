var elencoPrincipale = [];
var elencoPietanze = {};

function DataManager() {
    this.caricaDati = function() {
        var self = this;
        var urlWebApp = "https://script.google.com/macros/s/AKfycbxxc7r_TmQwX37jNrp34oB85JjeUNWUj74lvLUfXFRhpeIY8hG5RxaZe8opLZJJ6HU_wQ/exec";

        console.log("Tentativo di caricamento dati dalla Web App...");

        $.getJSON(urlWebApp, function(data) {
            // Supponendo che lo script restituisca un array di oggetti
            data.forEach(function(riga) {
                var categoria = riga.categoria || riga.Categoria; // Gestisce maiuscole/minuscole
                var pietanza = {
                    ID: riga.ID || riga.id,
                    descrizione: riga.descrizione || riga.Descrizione,
                    prezzo: riga.prezzo || riga.Prezzo
                };

                if (!elencoPietanze[categoria]) {
                    elencoPietanze[categoria] = [];
                    elencoPrincipale.push(categoria);
                }
                elencoPietanze[categoria].push(pietanza);
            });

            console.log("Dati caricati con successo dalla Web App.");
            // Notifica al main.js che può costruire l'interfaccia
            $(document).trigger("datiPronti");
        }).fail(function() {
            console.error("Errore nel caricamento dei dati dalla Web App. Verifica l'URL o i permessi dello script.");
        });
    };

    this.saveInstanceHashmap = function (hashmap) {
        var str = "";
        hashmap.keys().forEach(function(key) {
            str += key + ":" + hashmap.get(key) + ";";
        });
        $.cookie("ordine_hashmap", str, { expires: 1 });
    };

    this.getInstanceHashmap = function () {
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
