var Loader = function() {
    this.loadedDefs = {};
};

Loader.prototype = {
    get: function(src) {
        return this.loadedDefs[src];
    },

    fetch: function(src, type, callback) {
        if(this.get(src)) {
            return;
        }

        var head = document.head,
            link = document.createElement('link');

        link.href = src;
        link.rel = type;
        link.onload = callback;
        head.appendChild(link);

        this.loadedDefs[src] = link;
    },

    load: function(src, callback) {
        this.fetch(src, 'import', callback);
    },

    prefetch: function(src, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', src, false);
        xhr.send(null);

        // would be nice to use <link rel="prefetch" />, but it isn't
        // quite aggressive enough
//         this.fetch(src, 'subresource', callback);
    }
};
