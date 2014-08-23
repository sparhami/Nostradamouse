(function(scope) {
    var Utils = {
        mix: function(dest, src) {
            Object.keys(src).forEach(function(key) {
                dest[key] = src[key];
            });
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

        getAncestry: function(node) {
            var nodes = [],
                curNode;

            for(curNode = node; curNode; curNode = curNode.parentElement) {
                if(curNode instanceof HTMLElement) {
                    nodes.push(curNode);
                }
            }

            return nodes;
        }
    };

    scope.Utils = Utils;
})(Nostradamouse);
