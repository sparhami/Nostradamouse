/*jshint expr: true*/

describe('DepsTrackingLoader', function() {
    var sandbox = sinon.sandbox.create();

    beforeEach(function() {
        sandbox.stub(Loader.prototype, 'get');
        sandbox.stub(Loader.prototype, 'load');
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('loadDeps', function() {
        it('should call load for all the dependencies', function() {
            var depsStorage = {
                    getDeps: sinon.stub().withArgs('src').returns(['one', 'two'])
                },
                depsTrackingLoader = new DepsTrackingLoader(depsStorage);

            depsTrackingLoader.load = sinon.stub();
            depsTrackingLoader.loadDeps('src');

            expect(depsTrackingLoader.load)
                .to.have.been.calledWith('one')
                .to.have.been.calledWith('two');
        });
    });

    describe('updateDeps', function() {
        it('should persist the dependencies to storage', function() {
            var depsStorage = {
                    setDeps: sinon.spy()
                },
                doc = {
                    querySelectorAll: sinon.stub().returns([
                        {
                            href: 'one'
                        },
                        {
                            href: 'two'
                        }
                    ])
                },
                depsTrackingLoader = new DepsTrackingLoader(depsStorage);

            depsTrackingLoader.load = sinon.stub();
            depsTrackingLoader.updateDeps('src', doc);

            expect(depsStorage.setDeps).to.have.been.calledWith('src', ['one', 'two']);
        });

        it('should persist relative dependencies as relative paths', function() {
            var depsStorage = {
                    setDeps: sinon.spy()
                },
                doc = {
                    querySelectorAll: sinon.stub().returns([
                        {
                            href: location.origin + '/some/path'
                        }
                    ])
                },
                depsTrackingLoader = new DepsTrackingLoader(depsStorage);

            depsTrackingLoader.load = sinon.stub();
            depsTrackingLoader.updateDeps('src', doc);

            expect(depsStorage.setDeps).to.have.been.calledWith('src', ['/some/path']);
        });

        it('should call load for each of the dependencies', function() {
            var depsStorage = {
                    setDeps: sinon.spy()
                },
                doc = {
                    querySelectorAll: sinon.stub().returns([
                        {
                            href: 'one'
                        },
                        {
                            href: 'two'
                        }
                    ])
                },
                depsTrackingLoader = new DepsTrackingLoader(depsStorage);

            depsTrackingLoader.load = sinon.stub();
            depsTrackingLoader.updateDeps('src', doc);

            expect(depsTrackingLoader.load)
                .to.have.been.calledWith('one')
                .to.have.been.calledWith('two');
        });
    });

    describe('load', function() {
        it('should not attempt to load a source that is already loaded', function() {
            var depsTrackingLoader = new DepsTrackingLoader();

            Loader.prototype.get.returns(true);

            depsTrackingLoader.load('src');

            expect(Loader.prototype.load).to.not.have.been.called;
        });

        it('should return a promise that resolves loading', function(done) {
            var depsStorage = {
                    getDeps: sinon.stub().returns([])
                },
                callback = sinon.spy(),
                depsTrackingLoader = new DepsTrackingLoader(depsStorage);

            Loader.prototype.get.returns(undefined);
            Loader.prototype.load.returns(
                Promise.resolve({})
            );

            depsTrackingLoader.updateDeps = sinon.stub();
            depsTrackingLoader.load('src')
                .then(function() {})
                .then(done, done);
        });

        it('should call updateDeps after loading', function(done) {
            var depsStorage = {
                    getDeps: sinon.stub().returns([])
                },
                doc = {},
                depsTrackingLoader = new DepsTrackingLoader(depsStorage);

            Loader.prototype.get.returns(undefined);
            Loader.prototype.load.returns(
                Promise.resolve({
                    'import': doc
                })
            );

            depsTrackingLoader.updateDeps = sinon.stub();
            depsTrackingLoader.load('src')
                .then(function() {
                    expect(depsTrackingLoader.updateDeps).to.have.been.calledWith('src', doc);
                })
                .then(done, done);
        });

        it('should load all the deps for a given src', function() {
            var depsStorage = {
                    getDeps: sinon.stub()
                },
                depsTrackingLoader = new DepsTrackingLoader(depsStorage);

            Loader.prototype.get.returns(undefined);
            Loader.prototype.load.returns(
                Promise.resolve({})
            );

            depsStorage.getDeps.withArgs('src').returns(['one', 'two']);
            depsStorage.getDeps.withArgs('one').returns([]);
            depsStorage.getDeps.withArgs('two').returns([]);

            depsTrackingLoader.load('src');

            expect(Loader.prototype.load)
                .to.have.been.calledWith('src')
                .to.have.been.calledWith('one')
                .to.have.been.calledWith('two');
        });
    });
});
