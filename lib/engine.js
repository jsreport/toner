var path = require("path");

module.exports = function(toner, req, cb) {
    toner.scriptManager.execute({
        template: req.template,
        data: req.data,
        engine: req.template.pathToEngine,
        allowedModules: toner.options.allowedModules || [],
        nativeModules: toner.options.nativeModules || []
    }, {
        execModulePath: path.join(__dirname, "engineScript.js")
    }, cb);
};