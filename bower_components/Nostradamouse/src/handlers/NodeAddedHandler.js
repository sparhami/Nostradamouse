var NodeAddedHandler = function(loader, root) {
    this.loader = loader;
    this.root = root;
    this.triggers = {};
    this.observer = new MutationObserver(this.observe.bind(this));
};

NodeAddedHandler.prototype = {
    setupObserver: function() {
        var haveTriggers = !!Object.keys(this.triggers).length,
            observer = this.observer;

        if(haveTriggers) {
            observer.observe(this.root, { childList: true, subtree: true });
        } else {
            observer.disconnect();
        }
    },

    observe: function(mutations) {
        var loader = this.loader,
            triggers = this.triggers;

        mutations.forEach(function(mutation) {
            var addedNodes = [].slice.call(mutation.addedNodes);

            Utils
                .flatMap(addedNodes, Utils.getDescendants)
                .forEach(function(node) {
                    var trigger = triggers[node.tagName];

                    if(trigger) {
                        loader.load(trigger.src);
                        delete triggers[node.tagName];
                    }
                });
        });

        this.setupObserver();
    },

    addTrigger: function(params) {
        if(this.root.getElementsByTagName(params.tagName).length) {
            this.loader.load(params.src);
        } else {
            // TODO - support one tagName mapping to multiple srcs
            this.triggers[params.tagName.toUpperCase()] = params;
            this.setupObserver();
        }
    }
};
