function Data() {

    this.getInstanceHashmap = function () {

        var saved = $.cookie("hashmap");
        if (!saved) return new HashMap();

        try {
            var arr = JSON.parse(saved);   // array di Entry serializzati
            var map = new HashMap();

            arr.forEach(e => {
                map.put(parseInt(e.key), parseInt(e.val));
            });

            return map;

        } catch (e) {
            console.error("Errore lettura cookie hashmap:", e);
            return new HashMap();
        }
    };

    this.saveInstanceHashmap = function (map) {
        // 🔥 salva direttamente map.value
        $.cookie("hashmap", JSON.stringify(map.value), { expires: 1 });
    };

    this.getInstanceCoperti = function () {
        return $.cookie("coperti") || "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}
