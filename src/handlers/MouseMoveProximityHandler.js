var MouseMoveProximityHandler = function(loader, root) {
    DelegatedEventHandler.call(this, 'mousemove', loader, root);
};

Utils.extend(MouseMoveProximityHandler, DelegatedEventHandler, {
    isNear: function(rect, coords, distance) {
        var x = (rect.left + rect.right) / 2,
            y = (rect.top + rect.bottom) / 2,
            dx = Math.abs(coords.x - x) - (rect.width / 2),
            dy = Math.abs(coords.y - y) - (rect.height / 2);

        return dx <= distance && dy <= distance;
    },

    getTrippedTriggers: function(e) {
        var coords = {
                x: e.clientX,
                y: e.clientY
            };

        return this.triggers
            .filter(function(trigger) {
                return this.isNear(trigger.el.getBoundingClientRect(), coords, trigger.distance);
            }.bind(this));
    }
});
