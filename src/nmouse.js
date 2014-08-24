(function() {
    var loader = new Loader();

    var clickTriggerHandler = new DelegatedEventHandler('click', loader);
    var focusTriggerHandler = new DelegatedEventHandler('focus', loader);
    var mouseOverTriggerHandler = new DelegatedEventHandler('mouseover', loader);
    var mouseMoveProximityTriggerHandler = new MouseMoveProximityTrigger(loader);
    var nodeProximityTriggerHandler = new NodeProximityTrigger(loader);

    var proximityTriggerHandler = {
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
            'proximity': proximityTriggerHandler,
            'focus': focusTriggerHandler,
            'click': clickTriggerHandler,
            'mouseover': mouseOverTriggerHandler
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
        Loader: Loader
    };
})();
