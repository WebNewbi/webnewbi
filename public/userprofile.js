module.exports = function( req, res, next){
    if (req.isAuthenticated()){
      res.locals.username = req.user.name;
    }
    else {
      res.locals.username = undefined;
    }
  next();
};
