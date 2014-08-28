var DelegatedEventHandler = function(evtName, loader) {
    this.evtName = evtName;
    this.loader = loader;
    this.triggers = [];
};

DelegatedEventHandler.prototype = {
    setupListener: function() {
        var haveTriggers = !!this.triggers.length;

        window[haveTriggers ? 'addEventListener' : 'removeEventListener'](this.evtName, this, true);
    },

    getTrippedTriggers: function(e) {
        return Utils.getAncestry(e.target)
        .map(function(node) {
            return this.triggers.filter(function(trigger) {
                return node.matches(trigger.selector);
            });
        }, this)
        .reduce(function(p, c) {
            return p.concat(c);
        }, []);
    },

    handleEvent: function(e) {
        this.getTrippedTriggers(e)
        .forEach(function(trigger) {
            this.loader.load(trigger.src);
            trigger.tripped = true;
        }, this);

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
