"use strict";
(function() {

    Polymer('x-autosuggest', {
        publish: {
            opened: false
        },
        
        open: function(e) {
            this.opened = true;
            e && e.stopPropagation();
        },
        
        close: function(e) {
            this.opened = false;
            e && e.stopPropagation();
        },

        // Lifecycle
        created: function() {
            console.log('hello from x-autosuggest');
        },

        domReady: function() {
            this.inputBox = this.querySelector('input');
            
            if(!this.inputBox) {
                throw Error('Must provide an input to x-autosuggest.');
            }
            
            this.inputBox.addEventListener('input', this.open.bind(this));
        },

        ready: function() {

        }
    });
})();