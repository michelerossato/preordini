function DataManager() {
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
var graphicManager = new GraphicManager();
var qrcodeManager = new QRCodeManager();
