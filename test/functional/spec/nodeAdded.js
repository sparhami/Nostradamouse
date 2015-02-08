var assert = require('assert');

var basePath = require('../util/basePath');

function noop() {}

describe('Node added trigger', function () {
    describe('in the document', function() {
        it('should trigger when a matching element is added to the page', function (done) {
            this.browser
                .get(basePath + 'nodeAdded/afterRule.html')
                .elementByCssSelector('link[href="trigger-src"]')
                .then(noop)
                .then(done);
        });

        it('should trigger when a matching element is already on the page', function (done) {
            this.browser
                .get(basePath + 'nodeAdded/beforeRule.html')
                .elementByCssSelector('link[href="trigger-src"]')
                .then(noop)
                .then(done);
        });
    });

    describe('in a shadow root', function() {
        it('should trigger when a matching element is added to the page', function (done) {
            this.browser
                .get(basePath + 'nodeAdded/afterRuleShadow.html')
                .elementByCssSelector('link[href="trigger-src"]')
                .then(noop)
                .then(done);
        });

        it('should trigger when a matching element is already on the page', function (done) {
            this.browser
                .get(basePath + 'nodeAdded/beforeRuleShadow.html')
                .elementByCssSelector('link[href="trigger-src"]')
                .then(noop)
                .then(done);
        });
    });
});
