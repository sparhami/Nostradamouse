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

        getNode: function(thing) {
            if(typeof thing === 'string') {
                return document.querySelector(thing);
            } else if(thing instanceof HTMLElement) {
                return thing;
            }

            if(DEBUG) {
                throw Error('invalid thing specified');
            }
        },

        getAncestry: function _utilsGetAncestry(node) {
            return node ? [node].concat(_utilsGetAncestry(node.parentElement)) : [];
        },

        getDescendants: function _utilsGetDescendants(node) {
            var children = slice.call(node.children || []);

            return Utils
                .flatMap(children, _utilsGetDescendants)
                .concat(node);
        }
    };
})();
