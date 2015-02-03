var Loader = function() {
    this.loadedDefs = {};
};

Loader.prototype = {
    get: function(src) {
        return this.loadedDefs[src];
    },

    load: function(src) {
        if(!this.loadedDefs[src]) {
            this.loadedDefs[src] = new Promise(function(resolve, reject) {
                var head = document.querySelector('head'),
                    link = document.createElement('link');

                link.href = src;
                link.rel = 'import';
                link.onload = function() {
                    resolve(link);
                };
                link.onerror = function(reason) {
                    console.error('Failed to load resource ' + src);
                    reject();
                };
                head.appendChild(link);
            });
        }

        return this.loadedDefs[src];
    }
};
