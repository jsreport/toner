module.exports = function(req, res, cb) {
    res.headers["Content-Type"] = "text/html";
    res.headers["File-Extension"] = "html";
    res.headers["Content-Disposition"] = "inline; filename=\"report.html\"";

    cb();
};