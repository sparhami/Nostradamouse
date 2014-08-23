describe('NodeProximityTrigger', function() {
    var body = document.body,
        sandbox = sinon.sandbox.create(),
        NodeProximityTrigger = Nostradamouse.NodeProximityTrigger,
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

    describe('addTrigger', function() {
        var loader,
            nodeProximityTrigger;

        beforeEach(function() {
            loader = {
                load: sinon.spy()
            },
            nodeProximityTrigger = new NodeProximityTrigger(loader);

            container.style.height = '1000px';
            container.style.width = '1000px';
            container.innerHTML = '<div id="theDiv" style="position: absolute; top: 200px; left: 200px; width: 100px; height: 100px"></div>';
        });

        it('should create a tripwire around a node', function() {
            nodeProximityTrigger.addTrigger({
                el: container.querySelector('#theDiv'),
                src: 'some/src',
                distance: '100'
            });

            var tripwire = container.querySelector('.nmouse-tripwire'),
                rect = tripwire.getBoundingClientRect();

            expect(tripwire).to.not.be.null;
            expect(rect.top).to.equal(100);
            expect(rect.bottom).to.equal(400);
            expect(rect.left).to.equal(100);
            expect(rect.right).to.equal(400);
        });

        it('should call the loader when mousing over the tripwire', function() {
            nodeProximityTrigger.addTrigger({
                el: container.querySelector('#theDiv'),
                src: 'some/src',
                distance: '100'
            });

            var tripwire = container.querySelector('.nmouse-tripwire');

            tripwire.dispatchEvent(new CustomEvent('mouseover', {}));

            expect(loader.load).to.have.been.calledOnce;
            expect(loader.load).to.have.been.calledWith('some/src');
        });

        it('should remove the tripwire after triggering', function() {
            nodeProximityTrigger.addTrigger({
                el: container.querySelector('#theDiv'),
                src: 'some/src',
                distance: '100'
            });

            var tripwire = container.querySelector('.nmouse-tripwire');

            tripwire.dispatchEvent(new CustomEvent('mouseover', {}));
            tripwire = container.querySelector('.nmouse-tripwire');

            expect(tripwire).to.be.null;
        });
    });
});
