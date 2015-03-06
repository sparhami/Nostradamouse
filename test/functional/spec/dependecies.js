var assert = require('assert');

var basePath = require('../util/basePath');

describe('Dependency management', function () {
    it('should request dependencies from local storage', function () {
        return this.browser
            .get(basePath + 'dependencies/fromLocalStorage.html')
            .elementById('button')
                .click()
            .elementByCssSelector('link[href="trigger-src"]')
            .elementByCssSelector('link[href="trigger-dep-src"]');
    });
});

describe('Dependency importing', function () {
    it('should request declared dependencies', function () {
        return this.browser
            .get(basePath + 'dependencies/inPage.html')
            .elementById('button')
                .click()
            .elementByCssSelector('link[href="trigger-src"]')
            .elementByCssSelector('link[href="trigger-dep-src"]');
    });
});
