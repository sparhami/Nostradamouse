"use strict";
(function() {
    Polymer('x-settings', {
        publish: {
            opened: false
        },

        domReady: function() {
            this.$.dialog.addEventListener('core-overlay-open', this.handleOverlayOpenChange.bind(this))
        },

        handleOverlayOpenChange: function(evt) {
            if(!evt.target.opened) {
                this.opened = false;
            }
        }
    });
})();
