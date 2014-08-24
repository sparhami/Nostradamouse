/*jshint expr: true*/

describe('DelegatedEventHandler', function() {
    var loader,
        mouseMoveProximityTrigger;

    beforeEach(function() {
        loader = {
            load: sinon.spy()
        };

        mouseMoveProximityTrigger = new MouseMoveProximityTrigger(loader);
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

            mouseMoveProximityTrigger.addTrigger(triggerOne);
            mouseMoveProximityTrigger.addTrigger(triggerTwo);
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

            expect(mouseMoveProximityTrigger.getTrippedTriggers(event))
                .to.contain(triggerOne)
                .to.not.contain(triggerTwo);
        });
    });
});
