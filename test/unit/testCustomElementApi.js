/*jshint expr: true*/

describe('CustomElementAPi', function() {
    var body = document.body,
        sandbox = sinon.sandbox.create(),
        container;

    beforeEach(function() {
        container = document.createElement('div');
        body.appendChild(container);

        sandbox.stub(nmouse, 'prepare');
    });

    afterEach(function() {
        sandbox.restore();
        body.removeChild(container);
    });

    describe('nmouse-rule', function() {
        it('should call prepare with the triggers', function(done) {
            container.innerHTML = '' +
                '<nmouse-rule src="src" el="#someId">' +
                '<nmouse-trigger type="focus"></nmouse-trigger>' +
                '<nmouse-trigger type="click"></nmouse-trigger>' +
                '</nmouse-rule>';

            // NOTE: This needs to be async when using platform.js with Firefox
            setTimeout(function() {
                expect(nmouse.prepare)
                    .to.have.been.calledOnce
                    .to.have.been.calledWithMatch({
                        src: 'src',
                        el: '#someId',
                        selector: null,
                        triggers: [
                            {
                                distance: null,
                                tagName: null,
                                type: 'focus'
                            },
                            {
                                distance: null,
                                tagName: null,
                                type: 'click'
                            }
                        ]
                    });

                done();
            }, 0);
        });

        it('should call prepare for each rule', function(done) {
            container.innerHTML = '' +
                '<nmouse-rule src="src" el="#someId"></nmouse-rule>' +
                '<nmouse-rule src="src2" el="#someId2"></nmouse-rule>';

            // NOTE: This needs to be async when using platform.js with Firefox
            setTimeout(function() {
                expect(nmouse.prepare).to.have.been
                    .calledTwice
                    .calledWithMatch({
                        src: 'src',
                        el: '#someId',
                        selector: null,
                        triggers: []
                    })
                    .calledWithMatch({
                        src: 'src2',
                        el: '#someId2',
                        selector: null,
                        triggers: []
                    });

                done();
            }, 0);
        });
    });
});
