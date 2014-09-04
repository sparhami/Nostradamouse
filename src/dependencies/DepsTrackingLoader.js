var DepsTrackingLoader = function(depsStorage) {
    this.loader = new Loader();
    this.depsStorage = depsStorage;
};

DepsTrackingLoader.prototype = {
    load: function(src, callback) {
        var _this = this,
            loader = this.loader;

        if(loader.get(src)) {
            return;
        }

        loader.load(src, function(e) {
            _this.updateDeps(src, e.target.import);

            if(callback) {
                callback();
            }
        });

        this.loadDeps(src);
    },

    updateDeps: function(src, doc) {
        var links = [].slice.call(doc.querySelectorAll('link[rel="import"]')),
            deps = links.map(function(link) {
                return link.href;
            });

        this.depsStorage.setDeps(src, deps);
        /*
         * Try to load the dep just in case it has not been loaded by us before.
         * This is to make sure we traverse down and capture the whole
         * dependency tree on the first load of the page.
         */
        deps.forEach(this.load.bind(this));
    },

    loadDeps: function(src) {
        this.depsStorage.getDeps(src).forEach(this.load.bind(this));
    }
};
