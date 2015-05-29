var should = require("should");
var engine =  require("../lib/engine");
var path = require("path");
var scriptManager = require("script-manager")();

describe('engine', function(){

    var toner;
    beforeEach(function(done) {
        scriptManager.ensureStarted(done);

        toner = {
            scriptManager: scriptManager,
            options: {}
        };
    });

    it("should be able to return from a simple engine", function(done) {
        engine(toner, { template: { content: "content", pathToEngine:  path.join(__dirname, "emptyEngine.js") } },function(err, res) {
            if (err)
                return done(err);

            res.content.should.be.eql("content");
            done();
        });
    });

    it("should send compiled helpers to the engine", function(done) {
        engine(toner, { template: { content: "", helpers: "function a() { return \"foo\"; }", pathToEngine: path.join(__dirname, "helpersEngine.js") } }, function(err, res) {
            if (err)
                return done(err);

            res.content.should.be.eql("foo");
            done();
        });
    });

    it("should send data to the engine", function(done) {
        engine(toner, { template: { content: "", pathToEngine: path.join(__dirname, "dataEngine.js") }, data: { "a": { "val" : "foo" } } }, function(err, res) {
            if (err)
                return done(err);

            res.content.should.be.eql("foo");
            done();
        });
    });

    it("should block not allowed modules", function(done) {
        engine(toner, { template: { content: "", helpers: "function a() { require(\"fs\"); }", pathToEngine: path.join(__dirname, "helpersEngine.js") }  }, function(err, res) {
            if (!err)
                return done(new Error("Should have block not allowed fs module"));

            done();
        });
    });

    it("should be able to extend allowed modules", function(done) {
        toner.options.allowedModules = ["fs"];

        engine(toner, { template: { content: "", helpers: "function a() { require(\"fs\"); }", pathToEngine: path.join(__dirname, "helpersEngine.js") }  }, function(err, res) {
            if (err)
                return done(err);

            done();
        });
    });
});