(function() {
    var loader = new Loader();

    var clickHandler = new DelegatedEventHandler('click', loader);
    var focusHandler = new DelegatedEventHandler('focus', loader);
    var mouseOverHandler = new DelegatedEventHandler('mouseover', loader);
    var mouseMoveProximityHandler = new MouseMoveProximityHandler(loader);
    var nodeProximityHandler = new NodeProximityHandler(loader);

    var proximityHandler = {
        addTrigger: function(params) {
            var el = getNode(params.el),
                style = getComputedStyle(el);

            if(style.overflow !== 'visible' || style.position === 'static') {
                if(DEBUG) {
                    console.warn('Cannot create a simple trigger due to positioning or overflow, falling back to using mousemove.');
                }
                mouseMoveProximityTriggerHandler.addTrigger(params);
            } else {
                nodeProximityTriggerHandler.addTrigger(params);
            }
        }
    };

    function prepare(params) {
        params.triggers.forEach(function(trigger) {
            prepareTrigger(trigger, params);
        });
    }

    function prepareTrigger(trigger, params) {
        var provider = {
            'proximity': proximityHandler,
            'focus': focusHandler,
            'click': clickHandler,
            'mouseover': mouseOverHandler
        }[trigger.type];

        provider.addTrigger({
            el: params.el,
            selector: params.selector,
            src: params.src,
            distance: trigger.distance
        });
    }

    window.nmouse = {
        prepare: prepare,
        loader: loader
    };
})();
