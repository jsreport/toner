var path = require("path");

module.exports = function(brewer, req, cb) {
    brewer.scriptManager.execute({
        template: req.template,
        data: req.data,
        engine: req.template.pathToEngine,
        allowedModules: brewer.options.allowedModules || [],
        nativeModules: brewer.options.nativeModules || []
    }, {
        execModulePath: path.join(__dirname, "engineScript.js")
    }, cb);
};