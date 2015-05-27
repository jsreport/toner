module.exports = function(options) {
    var brewer = require("./lib/toner");
    brewer.init(options || {});
    return brewer;
};

module.exports.noneEngine = require("path").join(__dirname, "lib/noneEngine");
module.exports.htmlRecipe = require("./lib/htmlRecipe");