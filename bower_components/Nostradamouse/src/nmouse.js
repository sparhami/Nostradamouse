(function() {
    var loader = new DepsTrackingLoader(new DepsStorage(localStorage)),
        handlers = {};

    var proximityHandler = {
        addTrigger: function(params) {
            var style = getComputedStyle(params.el);

            if(style.overflow !== 'visible' || style.position === 'static') {
                if(DEBUG) {
                    console.warn('Cannot create a simple trigger due to positioning or overflow, falling back to using mousemove.');
                }
                getHandler('mousemove-proximity').addTrigger(params);
            } else {
                getHandler('node-proximity').addTrigger(params);
            }
        }
    };

    function prepare(params) {
        params.triggers.forEach(function(trigger) {
            prepareTrigger(trigger, params);
        });
    }

    function createHandler(type) {
        switch(type) {
            case 'added':
                return new NodeAddedHandler(loader);
            case 'proximity':
                return proximityHandler;
            case 'node-proximity':
                return new NodeProximityHandler(loader);
            case 'mousemove-proximity':
                return new MouseMoveProximityHandler(loader);
            default:
                return new DelegatedEventHandler(type, loader);
        }
    }

    function getHandler(type) {
        if(!handlers[type]) {
            handlers[type] = createHandler(type);
        }

        return handlers[type];
    }

    function prepareTrigger(trigger, params) {
        getHandler(trigger.type).addTrigger({
            el: Utils.getNode(params.el),
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
