var MouseMoveProximityTrigger = function(loader) {
    DelegatedEventHandler.call(this, 'mousemove', loader);
};

MouseMoveProximityTrigger.prototype = Utils.mix(Object.create(DelegatedEventHandler.prototype), {
    constructor: MouseMoveProximityTrigger,

    isNear: function(rect, coords, distance) {
        var x = (rect.left + rect.right) / 2,
            y = (rect.top + rect.bottom) / 2,
            dx = Math.max(Math.abs(coords.x - x) - (rect.width / 2), 0),
            dy = Math.max(Math.abs(coords.y - y) - (rect.height / 2), 0);

        return Math.sqrt(dx * dx + dy * dy) <= distance;
    },

    getTrippedTriggers: function(e) {
        var coords = {
            x: e.clientX,
            y: e.clientY
        };

        return triggers
        .filter(function(trigger) {
            return this.isNear(trigger.el.getBoundingClientRect(), coords, trigger.distance);
        }, this);
    }
});
