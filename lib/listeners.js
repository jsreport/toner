
var ListenersCollection = module.exports = function() {
    this._fns = [];
};

var collection = ListenersCollection.prototype;


collection.push = function(fn) {
    this._fns.push(fn);
};

collection.fire = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var cb = args[args.length - 1];

    if (!this._fns.length) {
        return cb();
    }

    var fnArgs = args.slice();
    fnArgs.pop();

    var results = [];
    var doneCounter = 0;
    var fns = this._fns;
    var self = this;
    fns.forEach(function(fn) {
        var lfnArgs = fnArgs.slice();
        lfnArgs.push(function(err, res) {
            if (err) {
                return cb(err);
            }

            doneCounter += 1;
            results.push(res);
            if (doneCounter === fns.length) {
                cb(null, results);
            }
        });

        fn.apply(self, lfnArgs);
    });
};