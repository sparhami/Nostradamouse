(function(scope) {
    var Loader = function() {
        this.loadedDefinitions = {};
    };

    Loader.prototype.load = function(src, callback) {
        if(this.loadedDefinitions[src]) {
            return;
        }

        var head = document.querySelector('head'),
            link = document.createElement('link');

        link.href = src;
        link.rel = 'import';
        link.onload = callback;
        head.appendChild(link);

        this.loadedDefinitions[src] = src;
    };

    scope.Loader = Loader;
})(Nostradamouse);
