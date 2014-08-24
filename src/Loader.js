var Loader = function() {
    this.loadedDefs = {};
};

Loader.prototype.load = function(src, callback) {
    var loadedDefs = this.loadedDefs;

    if(loadedDefs[src]) {
        return;
    }

    var head = document.querySelector('head'),
        link = document.createElement('link');

    link.href = src;
    link.rel = 'import';
    link.onload = callback;
    head.appendChild(link);

    loadedDefs[src] = src;
};
