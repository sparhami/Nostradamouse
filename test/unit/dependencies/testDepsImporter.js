/*jshint expr: true*/

describe('DepsImporter', function() {

    function createDepsNode(deps) {
        var root = document.createElement('nmouse-deps');

        deps
            .map(function(dep) {
                var node = document.createElement('nmouse-dep');

                node.setAttribute('id', dep.id);
                node.setAttribute('src', dep.src);

                if(dep.deps) {
                    node.setAttribute('deps', dep.deps.join(' '));
                }

                return node;
            })
            .forEach(function(node) {
                root.appendChild(node);
            });

        return root;
    }

    var storage,
        depsImporter;

    beforeEach(function() {
        storage = {
            setDeps: sinon.spy()
        };
        depsImporter = new DepsImporter(storage);
    });

    describe('importFromNode', function() {
        it('should add dependencies to the provided storage object', function() {
            var node = createDepsNode([
                    {
                        id: 'd1',
                        src: 'srcOne',
                        deps: ['d2', 'd3']
                    },
                    {
                        id: 'd2',
                        src: 'srcTwo'
                    },
                    {
                        id: 'd3',
                        src: 'srcThree'
                    }
                ]);

            depsImporter.importFromNode(node);

            expect(storage.setDeps)
                .to.have.been.calledWith('srcOne', ['srcTwo', 'srcThree']);
        });

        it('should handle empty dependency attributes', function() {
            var node = createDepsNode([
                    {
                        id: 'd1',
                        src: 'srcOne',
                        deps: ['d2']
                    },
                    {
                        id: 'd2',
                        src: 'srcTwo',
                        deps: []
                    }
                ]);

            depsImporter.importFromNode(node);

            expect(storage.setDeps)
                .to.have.been.calledWith('srcOne', ['srcTwo']);
        });

        it('should handle non-existant dependency attributes', function() {
            var node = createDepsNode([
                    {
                        id: 'd1',
                        src: 'srcOne',
                        deps: ['d2']
                    },
                    {
                        id: 'd2',
                        src: 'srcTwo'
                    }
                ]);

            depsImporter.importFromNode(node);

            expect(storage.setDeps)
                .to.have.been.calledWith('srcOne', ['srcTwo']);
        });

        it('should handle nested dependencies', function() {
            var node = createDepsNode([
                    {
                        id: 'd1',
                        src: 'srcOne',
                        deps: ['d2', 'd3']
                    },
                    {
                        id: 'd2',
                        src: 'srcTwo',
                        deps: ['d3', 'd4']
                    },
                    {
                        id: 'd3',
                        src: 'srcThree',
                        deps: ['d4']
                    },
                    {
                        id: 'd4',
                        src: 'srcFour'
                    }
                ]);

            depsImporter.importFromNode(node);

            expect(storage.setDeps)
                .to.have.been.calledWith('srcOne', ['srcTwo', 'srcThree'])
                .to.have.been.calledWith('srcTwo', ['srcThree', 'srcFour'])
                .to.have.been.calledWith('srcThree', ['srcFour']);
        });
    });
});
