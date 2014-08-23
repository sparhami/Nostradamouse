describe('Utils', function() {
    var body = document.body,
        sandbox = sinon.sandbox.create(),
        container;

    beforeEach(function() {
        container = document.createElement('div');
        container.id = 'container';
        body.appendChild(container);
    });

    afterEach(function() {
        sandbox.restore();
        body.removeChild(container);
    });

    describe('nmouse-rule', function() {
        it('should call prepare with the triggers', function() {
            sandbox.stub(nmouse, 'prepare');

            container.innerHTML = '' +
                '<nmouse-rule src="src" el="#someId">' +
                    '<nmouse-trigger type="focus"></nmouse-trigger>' +
                    '<nmouse-trigger type="click"></nmouse-trigger>' +
                '</nmouse-rule>';

            expect(nmouse.prepare).to.have.been.calledWithMatch({
                src: 'src',
                el: '#someId',
                selector: null,
                triggers: [
                    {
                        distance: null,
                        type: 'focus'
                    },
                    {
                        distance: null,
                        type: 'click'
                    }
                ]
            });
        });

        it('should call prepare for each rule', function() {
            sandbox.stub(nmouse, 'prepare');

            container.innerHTML = '' +
                '<nmouse-rule src="src" el="#someId"></nmouse-rule>' +
                '<nmouse-rule src="src2" el="#someId2"></nmouse-rule>';

            expect(nmouse.prepare).to.have.been.calledTwice;
            expect(nmouse.prepare).to.have.been.calledWithMatch({
                src: 'src',
                el: '#someId',
                selector: null,
                triggers: []
            });
            expect(nmouse.prepare).to.have.been.calledWithMatch({
                src: 'src2',
                el: '#someId2',
                selector: null,
                triggers: []
            });
        });
    });
});
