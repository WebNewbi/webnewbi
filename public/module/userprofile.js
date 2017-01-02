module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.username = req.user.name;
        res.locals.userObjectId = req.user.id;
    } else {
        res.locals.username = undefined;
        res.locals.userObjectId = undefined;
    }
    next();
};
