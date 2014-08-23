describe('Loader', function() {
    var loader,
        head = document.querySelector('head'),
        sandbox = sinon.sandbox.create();

    beforeEach(function() {
        loader = new Nostradamouse.Loader();
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('load', function() {
        it('should load a source by creating and appending a link element', function() {
            sinon.sandbox.stub(head, 'appendChild');

            loader.load('some/src');

            expect(head.appendChild).to.have.been.calledOnce;
            expect(head.appendChild).to.have.been.calledWithMatch(function(arg) {
                return arg instanceof HTMLLinkElement &&
                    arg.getAttribute('rel') === 'import' &&
                    arg.getAttribute('href') === 'some/src';
            });
        });

        it('should load multiple sources', function() {
            sinon.sandbox.stub(head, 'appendChild');

            loader.load('some/src');
            loader.load('some/other/src');

            expect(head.appendChild).to.have.been.calledTwice;
        });

        it('should not load the same source twice', function() {
            sinon.sandbox.stub(head, 'appendChild');

            loader.load('some/src');
            loader.load('some/src');

            expect(head.appendChild).to.have.been.calledOnce;
        });
    });
});
