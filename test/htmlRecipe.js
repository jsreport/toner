var should = require("should");
var html = require("../lib/htmlRecipe");

describe('html recipe', function () {

    it("should fill headers", function (done) {
        var res = {headers: {}};
        html({}, res, function () {
            res.headers["Content-Type"].should.be.ok;
            res.headers["File-Extension"].should.be.ok;
            res.headers["Content-Disposition"].should.be.ok;

            done();
        });
    });
});