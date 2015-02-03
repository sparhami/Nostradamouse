var DelegatedEventHandler = function(evtName, loader, root) {
    this.evtName = evtName;
    this.loader = loader;
    this.root = root;
    this.triggers = [];
};

DelegatedEventHandler.prototype = {
    setupListener: function() {
        var haveTriggers = !!this.triggers.length;

        this.root[haveTriggers ? 'addEventListener' : 'removeEventListener'](this.evtName, this, true);
    },

    getTrippedTriggers: function(e) {
        return Utils.getAncestry(e.target)
            // Ancestry returns Nodes, not Elements so need to
            // make sure the matches function is present
            .filter(function(node) {
                return node.matches;
            })
            .map(function(node) {
                return this.triggers.filter(function(trigger) {
                    return node.matches(trigger.selector);
                });
            }.bind(this))
            .reduce(function(p, c) {
                return p.concat(c);
            }, []);
    },

    handleEvent: function(e) {
        if(e.target === window) {
            return;
        }

        this.getTrippedTriggers(e)
            .forEach(function(trigger) {
                this.loader.load(trigger.src);
                trigger.tripped = true;
            }.bind(this));

        this.triggers = this.triggers
            .filter(function(trigger) {
                return !trigger.tripped;
            });

        this.setupListener();
    },

    addTrigger: function(params) {
        this.triggers.push(params);
        this.setupListener();
    }
};
