var express = require('express');
var passport = require('passport');

var router = express.Router();

// login
router.get("/", function(req, res) {
    res.render("login");
});

router.post("/",
    passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));


router.get("/google", passport.authenticate('google', {
    scope: ['profile', 'email']
}));


// the callback after google has authenticated the user
router.get("/google/callback",
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

router.get('/facebook', passport.authenticate('facebook', {
    scope: 'public_profile,email'
}));

router.get("/facebook/callback", passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


module.exports = router;
