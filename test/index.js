var should = require("should");
var index =  require("../");

describe('index', function(){

    it("calling index function should return brewer", function(done) {
        index().recipe.should.be.ok;
        done();
    });

    it("calling index function should return brewer", function(done) {
        var brewer = index();
        brewer.engine("none", index.noneEngine);
        brewer.recipe("html", index.htmlRecipe);

        brewer.render({ template: { content: "foo", recipe: "html", engine: "none"}}, function(err, res) {
            if (err)
                return done(err);

            res.content.toString().should.be.eql("foo");
            done();
        });
    });
});
