(function(scope) {
    var Loader = function() {
        this.loadedDefinitions = {};
    };

    Loader.prototype.load = function(src) {
        if(this.loadedDefinitions[src]) {
            return;
        }

        var head = document.querySelector('head'),
            link = document.createElement('link');

        link.href = src;
        link.rel = 'import';
        head.appendChild(link);

        this.loadedDefinitions[src] = src;
    };

    scope.Loader = Loader;
})(Nostradamouse);
