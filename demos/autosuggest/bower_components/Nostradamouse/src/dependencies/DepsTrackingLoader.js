var DepsTrackingLoader = function(depsStorage) {
    this.loader = new Loader();
    this.depsStorage = depsStorage;
};

DepsTrackingLoader.prototype = {
    load: function(src) {
        var _this = this,
            loader = this.loader,
            promise;

        if(loader.get(src)) {
            return loader.get(src);
        }

        promise = loader.load(src)
            .then(function(link) {
                _this.updateDeps(src, link.import);

                return link;
            });

        // Load deps afterwards so loading is blocked by max number of network
        // connections being used to load deps for non-SPDY / HTTP/2 case
        this.loadDeps(src);

        return promise;
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
        deps.forEach(function(dep) {
            this.load(dep);
        }.bind(this));
    },

    loadDeps: function(src) {
        var deps = this.depsStorage.getDeps(src);

        deps.forEach(function(dep) {
            this.load(dep);
        }.bind(this));
    }
};
