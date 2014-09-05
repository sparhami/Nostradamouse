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
        mutations.forEach(function(mutation) {
            for(var i=0; i<mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i],
                    trigger = this.triggers[node.tagName];

                if(trigger) {
                    this.loader.load(trigger.src);
                    delete this.triggers[node.tagName];
                }
            }
        }, this);

        this.setupObserver();
    },

    addTrigger: function(params) {
        // TODO - support one tagName mapping to multiple srcs
        this.triggers[params.tagName.toUpperCase()] = params;
        this.setupObserver();
    }
};
