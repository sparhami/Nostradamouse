(function(scope) {
    var DelegatedEventHandler = scope.DelegatedEventHandler,
        mix = scope.Utils.mix;

    function isNear(rect, coords, distance) {
        var x = (rect.left + rect.right) / 2,
            y = (rect.top + rect.bottom) / 2,
            dx = Math.max(Math.abs(coords.x - x) - (rect.width / 2), 0),
            dy = Math.max(Math.abs(coords.y - y) - (rect.height / 2), 0);

        return Math.sqrt(dx * dx + dy * dy) <= distance;
    }

    var MouseMoveProximityTrigger = function() {};

    MouseMoveProximityTrigger.prototype = mix(Object.create(DelegatedEventHandler.prototype), {
        constructor: function(loader) {
            DelegatedEventHandler.call(this, 'mousemove', loader);
        },

        getTrippedTriggers: function(e) {
            var coords = {
                    x: e.clientX,
                    y: e.clientY
                };

            return triggers
            .filter(function(trigger) {
                return isNear(trigger.el.getBoundingClientRect(), coords, trigger.distance);
            });
        }
    });

    scope.MouseMoveProximityTrigger = MouseMoveProximityTrigger;
})(Nostradamouse);
