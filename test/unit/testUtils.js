/*jshint expr: true*/

describe('Utils', function() {
    var body = document.querySelector('body'),
        container;

    beforeEach(function() {
        container = document.createElement('div');
        body.appendChild(container);
    });

    afterEach(function() {
        body.removeChild(container);
    });

    describe('getNode', function() {
        beforeEach(function() {
            container.innerHTML = '<div><div class="someClass"></div></div>';
        });

        it('should return the matching node when present', function() {
            var node = document.querySelector('.someClass');

            expect(Utils.getNode('.someClass')).to.equal(node);
        });

        it('should null when the matching node is not present', function() {
            var node = null;

            expect(Utils.getNode('#someId')).to.equal(node);
        });

        it('should a node when given a node', function() {
            var node = document.querySelector('.someClass');

            expect(Utils.getNode(node)).to.equal(node);
        });


        it('should throw an error when given an invalid thing in debug mode', function() {
            expect(Utils.getNode.bind(null, {})).to.throw(Error);
        });
    });

    describe('getAncestry', function() {
        beforeEach(function() {
            container.innerHTML = '<span class="someClass"></span>';
        });

        it('should return the matching node when present', function() {
            var ancestry = Utils.getAncestry(document.querySelector('.someClass')),
                nodeOne = document.querySelector('.someClass'),
                html = document.querySelector('html');

            expect(ancestry[0]).to.equal(nodeOne);
            expect(ancestry[1]).to.equal(container);
            expect(ancestry[2]).to.equal(body);
            expect(ancestry[3]).to.equal(html);
        });

    });

    describe('mix', function() {
        it('should copy properties from the source to the destination', function() {
            var src = {
                    propOne: 'value'
                },
                dest = {
                    propTwo: 2
                };

            Utils.mix(src, dest);

            expect(src).to.deep.equal({
                propOne: 'value',
                propTwo: 2
            });
        });
    });


    describe('extend', function() {
        var Child,
            Parent,
            childFn,
            parentFn;

        beforeEach(function() {
            Child = function() {};
            Parent = function() {};
            childFn = function() {};
            parentFn = function() {};

            Parent.prototype = {
                parentFn: parentFn
            };
        });

        it('should add the parent to child\'s prototype chain', function() {
            Utils.extend(Child, Parent, {
                childFn: childFn
            });

            expect(new Child()).to.be.instanceOf(Parent);
        });

        it('should set the child\'s constructor appropriately', function() {
            Utils.extend(Child, Parent, {
                childFn: childFn
            });

            expect(Child.prototype.constructor).to.equal(Child);
        });

        it('should add prototype memebers to the child', function() {
            Utils.extend(Child, Parent, {
                childFn: childFn
            });

            expect(Child.prototype.childFn).to.equal(childFn);
        });

        it('should handle extending without adding prototype memnbers', function() {
            Utils.extend(Child, Parent);

            expect(new Child()).to.be.instanceOf(Parent);
        });
    });
});
