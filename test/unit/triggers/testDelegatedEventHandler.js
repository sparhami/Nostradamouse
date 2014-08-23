describe('NodeProximityTrigger', function() {
    var body = document.body,
        sandbox = sinon.sandbox.create(),
        Utils = Nostradamouse.Utils,
        DelegatedEventHandler = Nostradamouse.DelegatedEventHandler,
        container,
        loader,
        delegatedEventHandler;

    beforeEach(function() {
        container = document.createElement('div');
        container.id = 'container';
        body.appendChild(container);

        loader = {
            load: sinon.spy()
        };

        delegatedEventHandler = new DelegatedEventHandler('click', loader);
    });

    afterEach(function() {
        sandbox.restore();
        body.removeChild(container);
    });

    describe('setupListener', function() {
        beforeEach(function() {
            sandbox.stub(window, 'addEventListener');
            sandbox.stub(window, 'removeEventListener');
        });

        it('should add a listener if there are triggers and no listener exists', function() {
            delegatedEventHandler.triggers = [{}];
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.calledOnce;
            expect(window.removeEventListener).to.have.been.notCalled;
        });

        it('should not add a listener if there are triggers and a listener exists', function() {
            delegatedEventHandler.triggers = [{}];
            delegatedEventHandler.setupListener();
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.calledOnce;
            expect(window.removeEventListener).to.have.been.notCalled;
        });

        it('should remove the listener if there are no triggers and a listener exists', function() {
            delegatedEventHandler.triggers = [{}];
            delegatedEventHandler.setupListener();

            delegatedEventHandler.triggers = [];
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.calledOnce;
            expect(window.removeEventListener).to.have.been.calledOnce;
        });


        it('should not remove the listener if there are no listener exists', function() {
            delegatedEventHandler.triggers = [];
            delegatedEventHandler.setupListener();

            expect(window.addEventListener).to.have.been.notCalled;
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
        });

        it('should return an array of all matching triggers in the ancestry', function() {
            nodeOne.matches.withArgs('selectorOne').returns(true);
            nodeTwo.matches.withArgs('selectorTwo').returns(true);
            sandbox.stub(Utils, 'getAncestry').returns([nodeOne, nodeTwo]);

            delegatedEventHandler.triggers = [triggerOne, triggerTwo];

            expect(delegatedEventHandler.getTrippedTriggers({})).to.deep.equal([triggerOne, triggerTwo])
        });

        it('should not return non-matching triggers in the ancestry', function() {
            nodeOne.matches.withArgs('selectorOne').returns(true);
            nodeTwo.matches.withArgs('selectorTwo').returns(false);
            sandbox.stub(Utils, 'getAncestry').returns([nodeOne, nodeTwo]);

            delegatedEventHandler.triggers = [triggerOne, triggerTwo];

            expect(delegatedEventHandler.getTrippedTriggers({})).to.deep.equal([triggerOne])
        });

        it('should return an array of all matching triggers for a given node', function() {
            nodeOne.matches.withArgs('selectorOne').returns(true);
            nodeOne.matches.withArgs('selectorTwo').returns(true);
            sandbox.stub(Utils, 'getAncestry').returns([nodeOne, nodeTwo]);

            delegatedEventHandler.triggers = [triggerOne, triggerTwo];

            expect(delegatedEventHandler.getTrippedTriggers({})).to.deep.equal([triggerOne, triggerTwo])
        });
    });
});
