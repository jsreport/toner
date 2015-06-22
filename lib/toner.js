var EventEmitter = require('events').EventEmitter;
var util = require("util");
var engine = require("./engine.js");
var ListenersCollection = require("./listeners");
var path = require("path");
var mkdirp = require("mkdirp");
var fs = require("fs");
var streamifier = require("streamifier");

function Toner(options) {
    this.options = options;
    this.options.tempDirectory = this.options.tempDirectory || require("os").tmpDir();
    this.options.allowedModules =  this.options.allowedModules || [];
    this.options.nativeModules =  this.options.nativeModules || [];
    this._engines = {};
    this._recipes = {};
    EventEmitter.call(this);
    this.scriptManager = require("script-manager")(options);
    this._beforeRender = new ListenersCollection();
    this._afterRender = new ListenersCollection();
    this._afterEngine = new ListenersCollection();

    if (!fs.existsSync(options.tempDirectory)) {
        mkdirp.sync(options.tempDirectory);
    }
}

util.inherits(Toner, EventEmitter);

Toner.prototype.engine = function(name, pathToEngine) {
    if (this._engines[name]) {
        throw new Error("Engine " + name + " already registered");
    }

    if (typeof pathToEngine !== "string" && !(pathToEngine instanceof String)) {
        throw new Error("pathToEngine must be a string");
    }

    this._engines[name] = pathToEngine;
};

Toner.prototype.recipe = function(name, fn) {
    if (this._recipes[name]) {
        throw new Error("Recipe " + name + " already registered");
    }
    this._recipes[name] = fn;
};

Toner.prototype.renderEngine = function(req, res, cb) {
    var self = this;

    if (!req.template.engine)   {
        return cb(new Error("Engine must be specified"));
    }

    if (!this._engines[req.template.engine]) {
        return cb(new Error("Engine '" + req.template.engine + "' not found"));
    }

    var pathToEngine = this._engines[req.template.engine];
    req.template.pathToEngine = pathToEngine;

    this.scriptManager.ensureStarted(function(err) {
        if (err) {
            return cb(err);
        }

        engine(self, req, function(err, engineRes) {
            if (err) {
                return cb(err);
            }

            res.content = new Buffer(engineRes.content);

            self._afterEngine.fire(req, res, function(err) {
                if(err) {
                    return cb(err);
                }

                cb();
            });
        });
    });
};

Toner.prototype.after = function(fn) {
    this._afterRender.push(fn);
};

Toner.prototype.before = function(fn) {
    this._beforeRender.push(fn);
};

Toner.prototype.afterEngine = function(fn) {
    this._afterEngine.push(fn);
};

Toner.prototype.render = function(req, cb) {
    var res = { headers : {}};
    req.toner = this;
    req.options = req.options || {};

    var self = this;

    this._beforeRender.fire(req, res, function(err) {
        if (err)
            return cb(err);

        self.renderEngine(req, res, function(err) {
            if (err) {
                return cb(err);
            }

            if (!req.template.recipe)   {
                return cb(new Error("Recipe must be specified"));
            }

            if (!self._recipes[req.template.recipe]) {
                return cb(new Error("Recipe '" + req.template.recipe + "' not found"));
            }

            self._recipes[req.template.recipe](req, res, function(err) {
                if (err) {
                    return cb(err);
                }

                self._afterRender.fire(req, res, function(err) {
                    if (err) {
                        return cb(err);
                    }

                    res.stream = streamifier.createReadStream(res.content);

                    cb(null, res);
                });
            });
        });
    });
};

module.exports = Toner;




