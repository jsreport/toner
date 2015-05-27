var should = require("should");
var ListenersCollection =  require("../lib/listeners");

describe('listeners', function(){

    var listeners;
    beforeEach(function() {
        listeners = new ListenersCollection();
    });

    it("fire should invoke listeners", function(done) {
        var monitor = 0;
        listeners.push(function(cb) {
            monitor++;
            cb();
        });

        listeners.push(function(cb) {
            monitor++;
            cb();
        });

        listeners.fire(function(err) {
            if (err) {
                return done(err);
            }

            monitor.should.be.eql(2);
            done();
        });
    });

    it("fire should propagate params", function(done) {
        var params = 0;
        listeners.push(function(a, cb) {
            a.should.be.eql("foo");
            done();
        });

        listeners.fire("foo", function(err) {
            if (err) {
                return done(err);
            }
        });
    });

    it("fire should callback when empty array", function(done) {
        listeners.fire("foo", function(err) {
            if (err) {
                return done(err);
            }

            done();
        });
    });
});