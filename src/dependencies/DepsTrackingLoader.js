
function isImport(dep) {
    return dep.type === 'import';
}

function isNotImport(dep) {
    return !isImport(dep);
}

var DepsTrackingLoader = function(depsStorage) {
    this.loader = new Loader();
    this.depsStorage = depsStorage;
};

DepsTrackingLoader.prototype = {
    load: function(src, callback) {
        var deps = this.depsStorage.getDeps(src);

        this.loadDeps(deps.filter(isNotImport));

        setTimeout(function() {
            this.loadDeps(deps.filter(isImport));
            this.loadSingle(src, callback);
        }.bind(this), 1);

    },

    loadSingle: function(src, callback) {
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
    },

    prefetch: function(src) {
        var loader = this.loader;

        if(loader.get(src)) {
            return;
        }

        loader.prefetch(src);
    },

    updateDeps: function(src, doc) {
        var slice = Array.prototype.slice,
            depElements = slice.call(doc.querySelectorAll('link, script')),
            deps = depElements
                .map(function(element) {
                    return {
                        src: element.href || element.src,
                        type: element.rel || element.type
                    };
                })
                .filter(function(dep) {
                    return dep.src;
                });

        this.depsStorage.setDeps(src, deps);
        /*
         * Try to load the deps just in case they have not been loaded by us
         * before. This is to make sure we traverse down and capture the whole
         * dependency tree on the first load of the page.
         */
        this.loadDeps(deps);
    },

    loadDeps: function(deps) {
        deps.forEach(function(dep) {
            if(dep.type === 'import') {
                this.loadSingle(dep.src);
            } else {
                this.prefetch(dep.src);
            }
        }.bind(this));
    },

    getDeps: function(src) {
        var depsStorage = this.depsStorage,
            encountered = {};

        function _getDeps(src) {
            depsStorage.getDeps(src).forEach(function(dep) {
                if(!encountered[dep.src]) {
                    encountered[dep.src] = dep;
                    _getDeps(dep.src, encountered);
                }
            });
        }

        _getDeps(src);

        return Object.keys(encountered).map(function(key) {
              return encountered[key];
        });
    }
};
