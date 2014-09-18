var NodeAddedHandler = function(loader) {
    this.loader = loader;
    this.triggers = {};
    this.observer = new MutationObserver(this.observe.bind(this));
};

NodeAddedHandler.prototype = {
    setupObserver: function() {
        var haveTriggers = !!Object.keys(this.triggers).length,
            observer = this.observer;

        if(haveTriggers) {
            observer.observe(document, { childList: true, subtree: true });
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
        // TODO - support one tagName mapping to multiple srcs
        this.triggers[params.tagName.toUpperCase()] = params;
        this.setupObserver();
    }
};
