var assert = require('assert');

var basePath = require('../util/basePath');

describe('Node added trigger', function () {
    describe('in the document', function() {
        it('should trigger when a matching element is added to the page', function () {
            return this.browser
                .get(basePath + 'nodeAdded/afterRule.html')
                .elementByCssSelector('link[href="trigger-src"]');
        });

        it('should trigger when a matching element is already on the page', function () {
            return this.browser
                .get(basePath + 'nodeAdded/beforeRule.html')
                .elementByCssSelector('link[href="trigger-src"]');
        });
    });

    describe('in a shadow root', function() {
        it('should trigger when a matching element is added to the page', function () {
            return this.browser
                .get(basePath + 'nodeAdded/afterRuleShadow.html')
                .elementByCssSelector('link[href="trigger-src"]');
        });

        it('should trigger when a matching element is already on the page', function () {
            return this.browser
                .get(basePath + 'nodeAdded/beforeRuleShadow.html')
                .elementByCssSelector('link[href="trigger-src"]');
        });
    });
});
