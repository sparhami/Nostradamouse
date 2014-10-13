var assert = require('assert');

var basePath = require('../util/basePath');

function noop() {}

describe('Event delegation triggers', function () {
    it('should trigger for a focus event', function (done) {
        this.browser
            .get(basePath + 'delegation/focus.html')
            .elementById('input')
                .click()
            .elementByCssSelector('link[href="trigger-src"]')
            .then(noop)
            .then(done);
    });

    it('should trigger for a custom event', function (done) {
        this.browser
            .get(basePath + 'delegation/customEvent.html')
            .elementById('button')
                .click()
            .elementByCssSelector('link[href="trigger-src"]')
            .then(noop)
            .then(done);
    });
});
