var assert = require('assert');

var basePath = require('../util/basePath');

function noop() {}

describe('Dependency management', function () {
    it('should request dependencies from local storage', function (done) {
        this.browser
            .get(basePath + 'dependencies/fromLocalStorage.html')
            .elementById('button')
                .click()
            .elementByCssSelector('link[href="trigger-src"]')
            .elementByCssSelector('link[href="trigger-dep-src"]')
            .then(noop)
            .then(done);
    });
});

describe('Dependency importing', function () {
    it('should request declared dependencies', function (done) {
        this.browser
            .get(basePath + 'dependencies/inPage.html')
            .elementById('button')
                .click()
            .elementByCssSelector('link[href="trigger-src"]')
            .elementByCssSelector('link[href="trigger-dep-src"]')
            .then(noop)
            .then(done);
    });
});
