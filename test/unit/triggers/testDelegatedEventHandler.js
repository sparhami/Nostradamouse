/*jshint expr: true*/

describe('DelegatedEventHandler', function() {
    var body = document.body,
        sandbox = sinon.sandbox.create(),
        Utils = Nostradamouse.Utils,
        DelegatedEventHandler = Nostradamouse.DelegatedEventHandler,
        container,
        loader,
        delegatedEventHandler;

    beforeEach(function() {
        container = document.createElement('div');
        body.appendChild(container);

        loader = {
            load: sinon.spy()
        };

        delegatedEventHandler = new DelegatedEventHandler('click', loader);

        sandbox.stub(window, 'addEventListener');
        sandbox.stub(window, 'removeEventListener');
    });

    afterEach(function() {
        sandbox.restore();
        body.removeChild(container);
    });

    describe('setupListener', function() {
        it('should add a listener if there are triggers and no listener exists', function() {
            delegatedEventHandler.addTrigger({});
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.calledOnce;
            expect(window.removeEventListener).to.have.been.notCalled;
        });

        it('should not add a listener if there are triggers and a listener exists', function() {
            delegatedEventHandler.addTrigger({});
            delegatedEventHandler.setupListener();
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.calledOnce;
            expect(window.removeEventListener).to.have.been.notCalled;
        });

        it('should remove the listener if there are no triggers and a listener exists', function() {
            delegatedEventHandler.addTrigger({});
            delegatedEventHandler.setupListener();

            delegatedEventHandler.triggers = [];
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.calledOnce;
            expect(window.removeEventListener).to.have.been.calledOnce;
        });


        it('should not remove the listener if there are no listener exists', function() {
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.notCalled;
            expect(window.removeEventListener).to.have.been.notCalled;
        });
    });

    describe('addTrigger', function() {
        it('should add a trigger', function() {
            var trigger = {
                prop: 'value'
            };

            delegatedEventHandler.addTrigger(trigger);

            expect(delegatedEventHandler.triggers).to.contain(trigger);
        });

        it('should add a listener', function() {
            delegatedEventHandler.addTrigger({});

            expect(window.addEventListener).to.have.been.calledOnce;
            expect(window.removeEventListener).to.have.been.notCalled;
        });
    });

    describe('getTrippedTriggers', function() {
        var nodeOne,
            nodeTwo,
            triggerOne,
            triggerTwo;

        beforeEach(function() {
            nodeOne = {
                matches: sinon.stub()
            };
            nodeTwo = {
                matches: sinon.stub()
            };
            triggerOne = {
                selector: 'selectorOne'
            };
            triggerTwo = {
                selector: 'selectorTwo'
            };

            sandbox.stub(Utils, 'getAncestry').returns([nodeOne, nodeTwo]);

            delegatedEventHandler.addTrigger(triggerOne);
            delegatedEventHandler.addTrigger(triggerTwo);
        });

        it('should return an array of all matching triggers in the ancestry', function() {
            nodeOne.matches.withArgs('selectorOne').returns(true);
            nodeTwo.matches.withArgs('selectorTwo').returns(true);

            expect(delegatedEventHandler.getTrippedTriggers({}))
                .to.contain(triggerOne)
                .to.contain(triggerTwo);
        });

        it('should not return non-matching triggers in the ancestry', function() {
            nodeOne.matches.withArgs('selectorOne').returns(true);
            nodeTwo.matches.withArgs('selectorTwo').returns(false);

            expect(delegatedEventHandler.getTrippedTriggers({}))
                .to.contain(triggerOne)
                .to.not.contain(triggerTwo);
        });

        it('should return an array of all matching triggers for a given node', function() {
            nodeOne.matches.withArgs('selectorOne').returns(true);
            nodeOne.matches.withArgs('selectorTwo').returns(true);

            expect(delegatedEventHandler.getTrippedTriggers({}))
                .to.contain(triggerOne)
                .to.contain(triggerTwo);
        });
    });

    describe('handleEvent', function() {
        var triggerOne,
            triggerTwo;

        beforeEach(function() {
            triggerOne = {
                src: 'srcOne'
            };
            triggerTwo = {
                src: 'srcTwo'
            };

            delegatedEventHandler.addTrigger(triggerOne);
            delegatedEventHandler.addTrigger(triggerTwo);
        });

        it('should use the loader to load tripped triggers', function() {
            var trigger = {
                prop: 'value'
            };

            sinon.stub(delegatedEventHandler, 'getTrippedTriggers').returns(delegatedEventHandler.triggers);
            delegatedEventHandler.handleEvent({});

            expect(loader.load)
                .to.have.been.calledTwice
                .to.have.been.calledWith('srcOne')
                .to.have.been.calledWith('srcTwo');
        });


        it('should remove tripped triggers', function() {
            var trigger = {
                prop: 'value'
            };

            sinon.stub(delegatedEventHandler, 'getTrippedTriggers').returns([triggerTwo]);
            delegatedEventHandler.handleEvent({});

            expect(delegatedEventHandler.triggers)
                .to.contain(triggerOne)
                .to.not.contain(triggerTwo);
            expect(window.removeEventListener).to.have.been.notCalled;
        });

        it('should remove event after all triggers have been tripped', function() {
            var trigger = {
                prop: 'value'
            };

            sinon.stub(delegatedEventHandler, 'getTrippedTriggers').returns([triggerOne, triggerTwo]);
            delegatedEventHandler.handleEvent({});

            expect(window.removeEventListener).to.have.been.called;
        });
    });
});
