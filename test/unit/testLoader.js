/*jshint expr: true*/

describe('Loader', function() {
    var loader,
        head = document.querySelector('head'),
        headAppendChild = head.appendChild;

    beforeEach(function() {
        loader = new Loader();

        head.appendChild = function(node) {
            node.onload();
        };

        sinon.spy(head, 'appendChild');
    });

    afterEach(function() {
        head.appendChild = headAppendChild;
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

        it('should load multiple sources', function(done) {


            loader.load('some/src');
            loader.load('some/other/src').then(function() {
                expect(head.appendChild).to.have.been.calledTwice;

                done();
            });
        });

        it('should not load the same source twice', function(done) {
            loader.load('some/src');
            loader.load('some/src').then(function() {
                expect(head.appendChild).to.have.been.calledOnce;

                done();
            });
        });
    });
});
