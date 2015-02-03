/*jshint expr: true*/

describe('MouseMoveProximityHandler', function() {
    var loader,
        root,
        mouseMoveProximityHandler;

    beforeEach(function() {
        loader = {
            load: sinon.spy()
        };

        root = {
            addEventListener: sinon.spy(),
            removeEventListener: sinon.spy()
        };

        mouseMoveProximityHandler = new MouseMoveProximityHandler(loader, root);
    });

    describe('getTrippedTriggers', function() {
        var triggerOne,
            triggerTwo,
            event;

        beforeEach(function() {
            triggerOne = {
                el: {
                    getBoundingClientRect: sinon.stub()
                },
                distance: 100
            };
            triggerTwo = {
                el: {
                    getBoundingClientRect: sinon.stub()
                },
                distance: 100
            };

            mouseMoveProximityHandler.addTrigger(triggerOne);
            mouseMoveProximityHandler.addTrigger(triggerTwo);
        });

        it('should return an array of all nearby triggers', function() {
            triggerOne.el.getBoundingClientRect.returns({
                top: 100,
                bottom: 200,
                left: 100,
                right: 200,
                width: 100,
                height: 100
            });
            triggerTwo.el.getBoundingClientRect.returns({
                top: 400,
                bottom: 500,
                left: 400,
                right: 500,
                width: 100,
                height: 100
            });
            event = {
                clientX: 0,
                clientY: 0
            };

            expect(mouseMoveProximityHandler.getTrippedTriggers(event))
                .to.contain(triggerOne)
                .to.not.contain(triggerTwo);
        });
    });
});
