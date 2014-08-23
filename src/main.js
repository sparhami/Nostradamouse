(function(scope) {
    'use strict';

    var loader = new scope.Loader();

    var ClickTrigger = new scope.DelegatedEventHandler('click', loader);
    var FocusTrigger = new scope.DelegatedEventHandler('focus', loader);
    var MouseOverTrigger = new scope.DelegatedEventHandler('mouseover', loader);
    var MouseMoveProximityTrigger = new scope.MouseMoveProximityTrigger(loader);
    var NodeProximityTrigger = new scope.NodeProximityTrigger(loader);

    var ProximityTrigger = (function() {
        return function(params) {
            var el = getNode(params.el),
                style = getComputedStyle(el);

            if(style.overflow !== 'visible' || style.position === 'static') {
                if(DEBUG) {
                    console.warn('Cannot create a simple trigger due to positioning or overflow, falling back to using mousemove.')
                }
                return MouseMoveProximityTrigger(params);
            } else {
                return NodeProximityTrigger(params);
            }
        };
    })();

    function prepare(params) {
        params.triggers.forEach(function(trigger) {
            prepareTrigger(trigger, params);
        });
    }

    function prepareTrigger(trigger, params) {
        var provider = {
                'proximity': ProximityTrigger,
                'focus': FocusTrigger,
                'click': ClickTrigger,
                'mouseover': MouseOverTrigger
            }[trigger.type];

        provider.addTrigger({
            el: params.el,
            selector: params.selector,
            src: params.src,
            distance: trigger.distance
        });
    }

    window.nmouse = scope.nmouse = {
        prepare: prepare
    };
})(Nostradamouse);
