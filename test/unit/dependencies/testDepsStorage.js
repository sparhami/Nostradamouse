/*jshint expr: true*/

describe('DepsStorage', function() {
    describe('getDeps', function() {
        it('should return the depdendencies from localStorage', function() {
            var storage = {
                    getItem: sinon.stub().returns('[ "one", "two" ]')
                },
                depsStorage = new DepsStorage(storage);

            expect(depsStorage.getDeps())
                .to.include('one')
                .to.include('two');
        });

        it('should return an empty array if there are no deps', function() {
            var storage = {
                    getItem: sinon.stub().returns(null)
                },
                depsStorage = new DepsStorage(storage);

            expect(depsStorage.getDeps()).to.deep.equal([]);
        });
    });

    describe('setDeps', function() {
        it('should store a stringified array of items', function() {
            var storage = {
                    setItem: sinon.spy()
                },
                depsStorage = new DepsStorage(storage);

            depsStorage.setDeps('src', [ 'one', 'two' ]);

            expect(storage.setItem).to.have.been.calledWith('nmouse-src', '["one","two"]');
        });
    });
});
