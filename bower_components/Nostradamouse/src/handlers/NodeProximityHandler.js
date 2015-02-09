var NodeProximityHandler = function(loader, root) {
    this.loader = loader;
    this.root = root;
};

NodeProximityHandler.prototype = {
    addTrigger: function(params) {
        var loader = this.loader,
            el = params.el,
            src = params.src,
            tripwire = document.createElement('div'),
            style = tripwire.style;

        style.position = 'absolute';
        style.top = 0;
        style.right = 0;
        style.left = 0;
        style.bottom = 0;
        style.margin = '-' + params.distance + 'px';

        tripwire.className = 'nmouse-tripwire';
        tripwire.addEventListener('mouseover', function() {
            loader.load(src);
            el.removeChild(tripwire);
        });

        el.appendChild(tripwire);
    }
};
