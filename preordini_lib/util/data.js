// ======================================================================
// DATA MANAGER
// ======================================================================
function Data() {

    // -----------------------------
    // ORDINE
    // -----------------------------
    this.getInstanceHashmap = function () {
        const saved = $.cookie("ordine");
        if (!saved) return {};
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Errore lettura ordine:", e);
            return {};
        }
    };

    this.saveInstanceHashmap = function (obj) {
        $.cookie("ordine", JSON.stringify(obj), { expires: 1 });
    };

    // -----------------------------
    // COPERTI
    // -----------------------------
    this.getInstanceCoperti = function () {
        return $.cookie("coperti") || "";
    };

    this.saveInstanceCoperti = function (v) {
        $.cookie("coperti", v, { expires: 1 });
    };
}
