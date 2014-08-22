if (typeof DEBUG === 'undefined') {
    DEBUG = true;
}

var nmouse = (function() {
    'use strict';
    
    function checkArgument(expr, message) {
        if(!expr) {
            throw Error(message);
        }
    }
    
    function DelgatedEventHandler(evtName) {
        this.evtName = evtName;
        this.triggers = [];
        this.eventAttached = false;
        
        return this.addTrigger.bind(this);
    }
    
    DelgatedEventHandler.prototype = {
         getAncestry: function(node) {
            var nodes = [],
                curNode;
            
            for(curNode = node; curNode; curNode = curNode.parentElement) {
                nodes.push(curNode);
            }
            
            return nodes.filter(function(node) {
                    return node.matches;
                });
        },
            
        setupListener: function() {
            if(!!this.triggers.length === !this.eventAttached) {
                window[this.eventAttached ? 'removeEventListener' : 'addEventListener'](this.evtName, this, true);
                this.eventAttached = !this.eventAttached;
            }
        },
        
        handleEvent: function(e) {
            this.getAncestry(e.target)
                .map(function(node) {
                    return this.triggers.filter(function(trigger) {
                        return node.matches(trigger.selector);
                    });
                }, this)
                .reduce(function(p, c) {
                    return p.concat(c);
                }, [])
                .forEach(function(trigger) {
                    loadDef(trigger.src);
                    trigger.tripped = true;
                });
        
            this.triggers = this.triggers
                .filter(function(trigger) {
                    return !trigger.tripped;
                });
            
            this.setupListener();
        },
        
        addTrigger: function(params) {
            this.triggers.push(params);
            this.setupListener();
        }
    };
    
    var ClickTrigger = new DelgatedEventHandler('click');
    var FocusTrigger = new DelgatedEventHandler('focus');
    var MouseOverTrigger = new DelgatedEventHandler('mouseover');
    
    var ProximityTrigger = (function() {
        var triggers = [],
            eventAttached = false;
        
        function isNear(el, coords, distance) {
            var bcr = el.getBoundingClientRect(),
                x = (bcr.left + bcr.right) / 2,
                y = (bcr.top + bcr.bottom) / 2,
                dx = Math.max(Math.abs(coords.x - x) - (bcr.width / 2), 0),
                dy = Math.max(Math.abs(coords.y - y) - (bcr.height / 2), 0);
            
            return Math.sqrt(dx * dx + dy * dy) <= distance;
        }
        
        function handleMousemove(evt) {
            var coords = {
                    x: evt.clientX,
                    y: evt.clientY
                };
            
            triggers
                .filter(function(trigger) {
                    return isNear(trigger.el, coords, trigger.distance);
                })
                .forEach(function(trigger) {
                    loadDef(trigger.src);
                    trigger.tripped = true;
                });
            
            triggers = triggers
                .filter(function(trigger) {
                    return !trigger.tripped;
                });
            
            checkAttachMouseMoveEvent();
        }
        
        function checkAttachMouseMoveEvent() {
            if(!!triggers.length === !eventAttached) {
                window[eventAttached ? 'removeEventListener' : 'addEventListener']('mousemove', handleMousemove, true);
                eventAttached = !eventAttached;
            }
        }
        
        function createMouseMoveProximityTrigger(params) {
            triggers.push(params);
            checkAttachMouseMoveEvent();
        }
        
        function createSimpleProximityTrigger(params) {
            var el = params.el,
                src = params.src,
                tripwire = document.createElement('div'),
                style = tripwire.style;
            
            style.position = 'absolute';
            style.top = 0;
            style.right = 0;
            style.left = 0;
            style.bottom = 0;
            style.margin = '-' + params.distance + 'px';
            
            tripwire.addEventListener('mouseover', function() {
                loadDef(src);
                el.removeChild(tripwire);
            });
            
            el.appendChild(tripwire);
        }
        
        return function(params) {
            var el = params.el,
                style = getComputedStyle(el);
            
            if(style.overflow !== 'visible' || style.position === 'static') {
                if(DEBUG) {
                    console.warn('Cannot create a simple trigger due to positioning or overflow, falling back to using mousemove.')
                }
                createMouseMoveProximityTrigger(params);
            } else if(SIMPLE_PROXIMITY_TRIGGERS) {
                createSimpleProximityTrigger(params);
            }
        };
    })();
    
    function prepare(params) {
        params.triggers.forEach(function(trigger) {
            prepareTrigger(trigger, params);
        });
    }
    
    function getNode(thing) {
        if(typeof thing === 'string') {
            return document.querySelector(thing);
        } else if(thing instanceof HTMLElement) {
            return thing;
        }
        
        if(DEBUG) {
            throw Error('invalid thing specified');
        }
    }
    
    function prepareTrigger(trigger, params) {
        var provider = {
                'proximity': ProximityTrigger,
                'focus': FocusTrigger,
                'click': ClickTrigger,
                'mouseover': MouseOverTrigger
            }[trigger.type];
        
        provider({
            el: getNode(params.el),
            selector: params.selector,
            src: params.src,
            distance: trigger.distance
        });
    }
    
    var loadDef = (function() {
        var loadedDefinitions = {};
        
        return function(src) {
            if(loadedDefinitions[src]) {
                return;
            }
            
            var head = document.querySelector('head'),
                link = document.createElement('link');
            
            link.href = src;
            link.rel = 'import';
            head.appendChild(link);
            
            loadedDefinitions[src] = src;
        };
    })();
    
    return {
        prepare: prepare
    };
})();

/**
 * Custom Element bindings
 * 
 * Example usage:
 * <code>
 *  <nmouse-rule 
 *   el="#some .css > selector"
 *   src="path/to/element/definition">
 *   <nmouse-trigger
 *     type="proximity"
 *     distance="100">
 *   </nmouse-trigger>
 *   <nmouse-trigger type="focus"></nmouse-trigger>
 *  </nmouse-rule>
 * </code>
 */
(function() {
    'use strict';

    var proto = Object.create(HTMLElement.prototype);
    
    proto.attachedCallback = function() {
        var triggers = [].slice.call(this.querySelectorAll('nmouse-trigger'))
            .map(function(node) {
                return {
                    type: node.getAttribute('type'),
                    distance: node.getAttribute('distance')
                };
            });
        
        nmouse.prepare({
            el: this.getAttribute('el'),
            selector: this.getAttribute('selector'),
            src: this.getAttribute('src'),
            triggers: triggers
        });   
    };
    
    document.registerElement('nmouse-rule', {
        prototype: proto
    });
})();