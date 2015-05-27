var should = require("should");
var path = require("path");

describe('toner', function(){

    var toner;
    beforeEach(function() {
        toner = require("../index.js")();
    });

    it("should fail when req.template.recipe not specified", function(done) {
        toner.engine("test", path.join(__dirname, "emptyEngine.js"));

        toner.render({ template: { content: "foo2", engine: "test" }}, function(err) {
            err.message.should.containEql("Recipe");
            done();
        });
    });

    it("should fail when req.template.engine not specified", function(done) {
        toner.recipe("test", function() {});

        toner.render({ template: { content: "foo2", recipe: "test" }}, function(err) {
            err.message.should.containEql("Engine");
            done();
        });
    });

    it("should fail when req.template.recipe not found", function(done) {
        toner.engine("test", path.join(__dirname, "emptyEngine.js"));
        toner.recipe("test", function() {});

        toner.render({ template: { content: "foo2", engine: "test", recipe: "test2" }}, function(err) {
            err.message.should.containEql("Recipe");
            done();
        });
    });

    it("should fail when req.template.engine not found", function(done) {
        toner.engine("test", path.join(__dirname, "emptyEngine.js"));
        toner.recipe("test", function() {});

        toner.render({ template: { content: "foo2", engine: "test2", recipe: "test" }}, function(err) {
            err.message.should.containEql("Engine");
            done();
        });
    });

    it("should add headers into the response", function(done) {
        toner.engine("test", path.join(__dirname, "emptyEngine.js"));
        toner.recipe("test", function(req, res, cb) {
            if (!res.headers) {
                return done("Should add headers into response");
            }

            done();
        });

        toner.render({ template: { content: "foo2", engine: "test", recipe: "test" }});
    });

    it("rendering should work", function(done){
        toner.engine("test", path.join(__dirname, "emptyEngine.js"));
        toner.recipe("test", function(req, res, cb) { res.content = new Buffer(req.template.content + "-recipe");cb(); });

        toner.render({ template: { content: "foo", engine: "test", recipe: "test"}}, function(err, resp) {
            resp.content.toString().should.be.eql("foo-recipe");
            done();
        });
    });

    it("rendering should fire hooks", function(done){
        toner.engine("test", path.join(__dirname, "emptyEngine.js"));
        toner.recipe("test", function(req, res, cb) { res.content = new Buffer(req.template.content + "-recipe");cb(); });

        var monitor = 0;
        toner.before(function(req, res, cb) {
            monitor++;
            req.should.be.ok;
            res.should.be.ok;
            cb();
        });

        toner.after(function(req, res, cb) {
            monitor++;
            req.should.be.ok;
            res.should.be.ok;
            cb();
        });

        toner.afterEngine(function(req, res, cb) {
            monitor++;
            req.should.be.ok;
            res.should.be.ok;
            cb();
        });

        toner.render({ template: { content: "foo", engine: "test", recipe: "test"}}, function(err, resp) {
            monitor.should.be.eql(3);
            done();
        });
    });
});