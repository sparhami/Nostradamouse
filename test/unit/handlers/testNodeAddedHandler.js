/*jshint expr: true*/

describe('NodeProximityHandler', function() {
    var body = document.body,
        container,
        sandbox = sinon.sandbox.create();

    beforeEach(function() {
        container = document.createElement('div');
        body.appendChild(container);
    });

    afterEach(function() {
        body.removeChild(container);
        sandbox.restore();
    });

    describe('setupObserver', function() {
        var nodeAddedHandler;

        beforeEach(function() {
            nodeAddedHandler = new NodeAddedHandler();
        });

        it('should observe the document for changes', function() {
            sandbox.spy(MutationObserver.prototype, 'observe');

            nodeAddedHandler.triggers = {
                prop: 'val'
            };
            nodeAddedHandler.setupObserver();

            expect(MutationObserver.prototype.observe).to.have.been.calledOnce;
        });

        it('should stop observing when there are no triggers', function() {
            sandbox.spy(MutationObserver.prototype, 'disconnect');

            nodeAddedHandler.triggers = {};
            nodeAddedHandler.setupObserver();

            expect(MutationObserver.prototype.disconnect).to.have.been.calledOnce;
        });
    });

    describe('addTrigger', function() {
        var nodeAddedHandler;

        beforeEach(function() {
            nodeAddedHandler = new NodeAddedHandler();
        });

        it('should add a trigger and call setupObserver', function() {
            sinon.spy(nodeAddedHandler, 'setupObserver');

            var trigger = {
                tagName: 'x-foo'
            };

            nodeAddedHandler.addTrigger(trigger);

            expect(nodeAddedHandler.triggers['X-FOO']).to.equal(trigger);
        });
    });

    describe('observe', function() {
        var nodeAddedHandler,
            loader;

        beforeEach(function() {
            loader = {
                load: sinon.spy()
            };
            nodeAddedHandler = new NodeAddedHandler(loader);
        });

        describe('tripped triggers', function() {
            beforeEach(function() {
                nodeAddedHandler.triggers['X-FOO'] = {
                    tagName: 'x-foo',
                    src: 'srcOne'
                };
                nodeAddedHandler.triggers['X-BAR'] = {
                    tagName: 'x-bar',
                    src: 'srcTwo'
                };

                sinon.spy(nodeAddedHandler, 'setupObserver');

                nodeAddedHandler.observe([
                    {
                        addedNodes: [
                            {
                                tagName: 'X-BAR'
                            },
                            {
                                tagName: 'DIV',
                                children: [{
                                    tagName: 'X-FOO'
                                }]
                            }
                        ]
                    }
                ]);
            });

            it('should call load for all tripped triggers', function() {
                expect(loader.load)
                    .to.have.been.calledWith('srcOne')
                    .to.have.been.calledWith('srcTwo');
            });

            it('should call setupObserver', function() {
                expect(nodeAddedHandler.setupObserver).to.have.been.calledOnce;
            });

            it('should remove tripped triggers', function() {
                expect(nodeAddedHandler.triggers['X-FOO']).to.be.be.undefined;
                expect(nodeAddedHandler.triggers['X-BAR']).to.be.be.undefined;
            });
        });
    });
});
