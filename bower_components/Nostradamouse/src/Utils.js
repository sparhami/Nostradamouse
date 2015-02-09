var Utils = (function() {
    var slice = Array.prototype.slice;

    return {
        flatMap: function(items, fn) {
            return items.reduce(function(p, c) {
                return p.concat(fn(c));
            }, []);
        },

        mix: function(dest, src) {
            Object.keys(src).forEach(function(key) {
                dest[key] = src[key];
            });

            return dest;
        },

        extend: function(child, parent, protoFunctions) {
            child.prototype = this.mix(Object.create(parent.prototype), protoFunctions || {});
            child.prototype.constructor = child;
        },

        getAncestry: function _utilsGetAncestry(node) {
            return node ? [node].concat(_utilsGetAncestry(node.parentNode)) : [];
        },

        getDescendants: function _utilsGetDescendants(node) {
            var children = slice.call(node.children || []);

            return Utils
                .flatMap(children, _utilsGetDescendants)
                .concat(node);
        }
    };
})();
