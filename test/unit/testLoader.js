/*jshint expr: true*/

describe('Loader', function() {
    var loader,
        head = document.querySelector('head'),
        sandbox = sinon.sandbox.create();

    beforeEach(function() {
        loader = new Loader();

        sinon.sandbox.stub(head, 'appendChild');
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('load', function() {
        it('should load a source by creating and appending a link element', function() {
            loader.load('some/src');

            expect(head.appendChild).to.have.been
                .calledOnce
                .calledWithMatch(function(arg) {
                    return arg instanceof HTMLLinkElement &&
                        arg.getAttribute('rel') === 'import' &&
                        arg.getAttribute('href') === 'some/src';
                });
        });

        it('should load multiple sources', function() {
            loader.load('some/src');
            loader.load('some/other/src');

            expect(head.appendChild).to.have.been.calledTwice;
        });

        it('should not load the same source twice', function() {
            loader.load('some/src');
            loader.load('some/src');

            expect(head.appendChild).to.have.been.calledOnce;
        });
    });
});
