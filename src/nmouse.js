(function() {
    var loader = new DepsTrackingLoader(new DepsStorage(localStorage)),
        handlers = new WeakMap(); // keeps track of an the handlers for each root

    var ProximityHandler = function(loader, root) {
        this.root = root;
    };

    ProximityHandler.prototype.addTrigger = function(params) {
        var style = getComputedStyle(params.el);

        if(style.overflow !== 'visible' || style.position === 'static') {
            if(DEBUG) {
                console.warn('Cannot create a simple trigger due to positioning or overflow, falling back to using mousemove.');
            }
            getHandler('mousemove-proximity', this.root).addTrigger(params);
        } else {
            getHandler('node-proximity', this.root).addTrigger(params);
        }
    };

    function prepare(params, shadowRoot) {
        var root = shadowRoot || document.body;

        params.triggers.forEach(function(trigger) {
            prepareTrigger(trigger, params, root);
        });
    }

    function createHandler(type, root) {
        switch(type) {
            case 'added':
                return new NodeAddedHandler(loader, root);
            case 'proximity':
                return new ProximityHandler(loader, root);
            case 'node-proximity':
                return new NodeProximityHandler(loader, root);
            case 'mousemove-proximity':
                return new MouseMoveProximityHandler(loader, root);
            default:
                return new DelegatedEventHandler(type, loader, root);
        }
    }

    function getHandler(type, root) {
        if(!handlers.get(root)) {
           handlers.set(root, {});
        }

        if(!handlers.get(root)[type]) {
            handlers.get(root)[type] = createHandler(type, root);
        }

        return handlers.get(root)[type];
    }

    function prepareTrigger(trigger, params, root) {
        var el = params.el;

        getHandler(trigger.type, root).addTrigger({
            el: typeof el === 'string' ? root.querySelector(el) : el,
            selector: params.selector,
            src: params.src,
            tagName: trigger.tagName,
            distance: trigger.distance
        });
    }

    window.nmouse = {
        prepare: prepare,
        loader: loader
    };
})();
