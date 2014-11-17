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
document.registerElement('nmouse-rule', {
    prototype: Utils.mix(Object.create(HTMLElement.prototype), {
        attachedCallback: function() {
            var triggers = [].slice.call(this.querySelectorAll('nmouse-trigger'))
                .map(function(node) {
                    return {
                        type: node.getAttribute('type'),
                        tagName: node.getAttribute('tagName'),
                        distance: node.getAttribute('distance')
                    };
                });

            nmouse.prepare({
                el: this.getAttribute('el'),
                selector: this.getAttribute('selector'),
                src: this.getAttribute('src'),
                triggers: triggers
            });
        }
    })
});
