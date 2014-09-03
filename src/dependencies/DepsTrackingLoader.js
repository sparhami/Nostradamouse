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
        var deps = [].map.call(doc.querySelectorAll('link[rel="import"]'), function(link) {
                return link.href;
            });

        this.depsStorage.setDeps(src, deps);
    },

    loadDeps: function(src) {
        this.depsStorage.getDeps(src).forEach(this.load, this);
    }
};
