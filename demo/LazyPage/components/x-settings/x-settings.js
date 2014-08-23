"use strict";
(function() {
    Polymer('x-settings', {
        publish: {
            opened: false
        },

        // Lifecycle
        created: function() {
            console.log('hello from x-settings');
        },

        domReady: function() {
            this.$.dialog.addEventListener('core-overlay-open', this.handleOverlayOpenChange.bind(this))
        },

        ready: function() {

        },
        
        handleOverlayOpenChange: function(evt) {
            if(!evt.target.opened) {
                this.opened = false;
            }
        }
    });
})();