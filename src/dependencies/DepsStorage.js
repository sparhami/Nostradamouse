// TODO - expire caching based on date, size limitations
// -> keep track of keys that we add so that we can clear individual keys as needed
// -> [ { key, timeLastUsed }, ... ]

function DepsStorage() {
    this.storage = localStorage;
}

DepsStorage.prototype = {
    getKey: function(src) {
        return 'nmouse-' + src;
    },

    getDeps: function(src) {
        var key = this.getKey(src);

        return JSON.parse(this.storage.getItem(key)) || [];
    },

    setDeps: function(src, deps) {
        var key = this.getKey(src);

        this.storage.setItem(key, JSON.stringify(deps));
    }
};
