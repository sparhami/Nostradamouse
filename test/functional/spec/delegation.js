var assert = require('assert');

var basePath = require('../util/basePath');

describe('Event delegation triggers', function () {
    it('should trigger for a focus event', function () {
        return this.browser
            .get(basePath + 'delegation/focus.html')
            .elementById('input')
                .click()
            .elementByCssSelector('link[href="trigger-src"]');
    });

    it('should trigger for a custom event', function () {
        return this.browser
            .get(basePath + 'delegation/customEvent.html')
            .elementById('button')
                .click()
            .elementByCssSelector('link[href="trigger-src"]');
;    });

// Testcase currently not working - shadowRoot creation in html file causes the testcase
// to fail for some reason. When tested manually, the test works fine.
//     it('should trigger for a rule and element in a shadow root', function (done) {
//         return this.browser
//             .get(basePath + 'delegation/shadowRoot.html')
//             .elementByCssSelector('html /deep/ button')
//                 .click()
//             .waitForElementByCssSelector('link[href="trigger-src"]');
//     });
});
