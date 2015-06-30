var should = require("should");
var index =  require("../");

describe('index', function(){

    it("calling index function should return toner", function(done) {
        index().recipe.should.be.ok;
        done();
    });

    it("returned tuner should not be singleton", function(done) {
        index().engine("none", index.noneEngine);
        index().engine("none", index.noneEngine);
        done();
    });

    it("index should include noneEngine and htmlRecipe", function(done) {
        var toner = index();
        toner.engine("none", index.noneEngine);
        toner.recipe("html", index.htmlRecipe);

        toner.render({ template: { content: "foo", recipe: "html", engine: "none"}}, function(err, res) {
            if (err)
                return done(err);

            res.content.toString().should.be.eql("foo");
            done();
        });
    });
});
