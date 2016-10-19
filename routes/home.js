var express = require('express');
var Member = require("../models/members");
var Travel = require("../models/travels");
var passport = require('passport');

var router = express.Router();

router.get("/", function(req, res) {
    Travel.find({}, function(err, travels) {
        if (err) return res.json(err);
        res.render("index", {
            travels: travels,
            username: req.session.name
        });
    });

});

router.get("/signup", function(req, res) {
    res.render("signup");
});

router.post("/signup", function(req, res) {
    Member.findOne({
        'local.email' :  req.body.email
    }, function(err, member) {
        if (err) return res.json(err);
        if (member === null) {
            Member.create( {  'local.email'           : req.body.email,
                              'local.password'        : req.body.password,
                              'passwordConfirmation'  : req.body.passwordConfirmation},
               function(err, member) {
                if (err) return res.json(err);
                res.redirect("/login");
            });
        }
    });
});

// login
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login",
    passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

router.get('/login/facebook', passport.authenticate('facebook', { scope : 'public_profile,email' }));

router.get("/login/facebook/callback", passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  })
);

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));


// Contacts - New
router.get("/new", function(req, res) {
    res.render("new");
});

// Contacts - create
router.post("/new", function(req, res) {
    Travel.create(req.body, function(err, travel) {
        if (err) return res.json(err);
        res.redirect("/");
    });
});


// for trigger route test
var cb0 = function(req, res, next) {
    console.log('CB0');
    var temp = false;
    if (temp) {
        next();
    } else {
        res.send('temp is not true');
    }
};

var cb1 = function(req, res, next) {
    console.log('CB1');
    next();
};

var cb2 = function(req, res) {
    res.send('Hello from C!');
};

router.get("/hello", [cb0, cb1, cb2]);


//
router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user: req.user // get the user out of session and pass to template
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function(err){
  });
    res.redirect('/');
});

//// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
