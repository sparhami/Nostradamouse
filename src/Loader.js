var Loader = function() {
    this.loadedDefs = {};
};

Loader.prototype = {
    get: function(src) {
        return this.loadedDefs[src];
    },

    load: function(src, callback) {
        if(this.get(src)) {
            return;
        }

        var head = document.querySelector('head'),
            link = document.createElement('link');

        link.href = src;
        link.rel = 'import';
        link.onload = callback;
        head.appendChild(link);

        this.loadedDefs[src] = link;
    }
};
