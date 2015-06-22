var Toner = require("./lib/toner");

module.exports = function(options) {
    return new Toner(options || {});
};

module.exports.Toner = Toner;
module.exports.noneEngine = require("path").join(__dirname, "lib/noneEngine");
module.exports.htmlRecipe = require("./lib/htmlRecipe");