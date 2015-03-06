/*jshint expr: true*/

describe('Loader', function() {
    var sandbox = sinon.sandbox.create(),
        loader,
        head = document.querySelector('head'),
        headAppendChild = head.appendChild;

    beforeEach(function() {
        loader = new Loader();

        sandbox.stub(head, 'appendChild', function(node) {
            node.onload();
        });
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

            return loader.load('some/other/src')
                .then(function() {
                    expect(head.appendChild).to.have.been.calledTwice;
                });
        });

        it('should not load the same source twice', function() {
            loader.load('some/src');

            return loader.load('some/src')
                .then(function() {
                    expect(head.appendChild).to.have.been.calledOnce;
                });
        });
    });
});
