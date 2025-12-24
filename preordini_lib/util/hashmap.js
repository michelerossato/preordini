function HashMap() {
    this.value = [];

    /**
       verifica se la mappa e' vuota
    */
    this.isEmpty = function () {
        return this.value.length == 0;
    };

    /**
       restituisce il numero di elementi contenuti nella mappa
    */
    this.size = function () {
        return this.value.length;
    };

    /**
       restituisce il valore associato alla chiave specificata
    */
    this.get = function (key) {
        var pos = binarySearch(this.value, parseInt(key));
        if (pos < 0) return undefined;
        return this.value[pos].getValue();
    };

    /**
       inserisce l'associazione key/value nella mappa.
    */
    this.put = function (key, value) {
        this.remove(parseInt(key));
        var entry = new Entry(parseInt(key), value);
        this.value[this.value.length] = entry;
        mergeSort(this.value);
        return entry.getValue();
    };

    /**
       elimina l'associazione con la chiave specificata
    */
    this.remove = function (key) {
        var pos = binarySearch(this.value, parseInt(key));
        if (pos < 0) return undefined;
        var val = this.value[pos].getValue();
        this.value.splice(pos, 1);
        return val;
    };

    this.makeEmpty = function () {
        this.value = [];
    };

    this.contains = function (key) {
        var pos = binarySearch(this.value, parseInt(key));
        return pos >= 0;
    };

    this.keys = function () {
        var objs = [];
        for (var i = 0; i < this.value.length; i++)
            objs.push(parseInt(this.value[i].getKey()));
        return objs;
    };

    /**
       NOVITÀ: Converte la mappa in un oggetto semplice per i cookie
    */
    this.toObject = function () {
        var obj = {};
        for (var i = 0; i < this.value.length; i++) {
            obj[this.value[i].getKey()] = this.value[i].getValue();
        }
        return obj;
    };

    /**
       NOVITÀ: Ricostruisce la mappa partendo da un oggetto salvato
    */
    HashMap.fromObject = function (obj) {
        var map = new HashMap();
        if (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    map.put(parseInt(key), obj[key]);
                }
            }
        }
        return map;
    };

    // --- FUNZIONI INTERNE DI SUPPORTO ---

    function mergeSort(a) {
        if (a.length <= 1) return;
        var mid = Math.floor(a.length / 2);
        var left = a.slice(0, mid);
        var right = a.slice(mid, a.length);
        mergeSort(left);
        mergeSort(right);
        merge(a, left, right);
    }

    function merge(a, b, c) {
        var ia = 0, ib = 0, ic = 0;
        while (ib < b.length && ic < c.length) {
            if (b[ib].getKey() < c[ic].getKey()) a[ia++] = b[ib++];
            else a[ia++] = c[ic++];
        }
        while (ib < b.length) a[ia++] = b[ib++];
        while (ic < c.length) a[ia++] = c[ic++];
    }

    function binarySearch(array, searchElement) {
        var minIndex = 0;
        var maxIndex = array.length - 1;
        while (minIndex <= maxIndex) {
            var currentIndex = (minIndex + maxIndex) / 2 | 0;
            var currentElement = array[currentIndex];
            if (currentElement.getKey() < searchElement) minIndex = currentIndex + 1;
            else if (currentElement.getKey() > searchElement) maxIndex = currentIndex - 1;
            else return currentIndex;
        }
        return -1;
    }

    function Entry(k, v) {
        this.key = k;
        this.val = parseInt(v);
        this.getKey = function () { return this.key; };
        this.getValue = function () { return parseInt(this.val); };
    }
}
