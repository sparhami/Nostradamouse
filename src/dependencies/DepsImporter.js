function DepsImporter(storage) {
    this.storage = storage;
}

DepsImporter.prototype = {
    importFromNode: function(node) {
        var deps = [].slice.call(node.getElementsByTagName('nmouse-dep')),
            depsMapping = {};

        deps.forEach(function(dep) {
            depsMapping[dep.getAttribute('data-id')] = dep;
        });

        deps.map(function(dep) {
            var src = dep.getAttribute('src'),
                depIds = dep.getAttribute('deps'),
                depSrcs = depIds && depIds
                    .split(' ')
                    .map(function(id) {
                        return depsMapping[id];
                    })
                    .map(function(el) {
                        return el.getAttribute('src');
                    });

            if(depSrcs) {
                this.storage.setDeps(src, depSrcs);
            }
        }.bind(this));
    }
};
