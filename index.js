module.exports = function(options) {
    var toner = require("./lib/toner");
    toner.init(options || {});
    return toner;
};

module.exports.noneEngine = require("path").join(__dirname, "lib/noneEngine");
module.exports.htmlRecipe = require("./lib/htmlRecipe");