var assert = require('assert');

var basePath = require('../util/basePath');

describe('Proximity delegation trigger', function () {
    it('should trigger static positioned elements', function () {
        return this.browser
            .get(basePath + 'proximity/staticPositioning.html')
            .elementById('button')
            .moveTo(150, 150)
            .elementByCssSelector('link[href="trigger-src"]');
    });

    it('should trigger relative positioned elements', function () {
        return this.browser
            .get(basePath + 'proximity/relativePositioning.html')
            .elementById('button')
            .moveTo(150, 150)
            .elementByCssSelector('link[href="trigger-src"]');
    });
});
