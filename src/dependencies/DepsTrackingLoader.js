var DepsTrackingLoader = function(depsStorage) {
    this.loader = new Loader();
    this.originRegExp = new RegExp('^' + location.origin);
    this.depsStorage = depsStorage;
};

DepsTrackingLoader.prototype = {
    load: function(src) {
        var loader = this.loader,
            promise;

        if(loader.get(src)) {
            return loader.get(src);
        }

        promise = loader.load(src)
            .then(function(link) {
                this.updateDeps(src, link.import);

                return link;
            }.bind(this));

        // Load deps afterwards so loading is blocked by max number of network
        // connections being used to load deps for non-SPDY / HTTP/2 case
        this.loadDeps(src);

        return promise;
    },

    getNormalizedHref: function(href) {
        return href.replace(this.originRegExp, '');
    },

    updateDeps: function(src, doc) {
        var links = [].slice.call(doc.querySelectorAll('link[rel="import"]')),
            deps = links.map(function(link) {
                return this.getNormalizedHref(link.href);
            }.bind(this));

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
