var express = require('express');
var Member = require("../models/members");
var Schedule = require("../models/schedule");

var router = express.Router();

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
    storage: storage
});

router.get("/", function(req, res) {
    Schedule.find({}, function(err, scheduls) {
        if (err) return res.json(err);
        res.render("index", {
            scheduls: scheduls,
            searchResult: false
        });
    });
});

router.get("/test", function(req, res) {
    Schedule.find({}, function(err, scheduls) {
        if (err) return res.json(err);
        res.send(scheduls);
    });
});


router.get("/signup", function(req, res) {
    res.render("signup");
});

router.post("/signup", function(req, res) {
    Member.findOne({
        'local.email': req.body.email
    }, function(err, member) {
        if (err) return res.json(err);
        if (member === null) {
            Member.create({
                    'local.email': req.body.email,
                    'local.password': req.body.password,
                    'email': req.body.email,
                    'name': req.body.email,
                    'passwordConfirmation': req.body.passwordConfirmation
                },
                function(err, member) {
                    if (err) return res.json(err);
                    res.redirect("/login");
                });
        }
    });
});

router.get("/profile", function(req, res) {
    Member.findOne({
        '_id': req.session.passport.user
    }, function(err, user) {
        if (err) return res.json(err);
        res.render("profile", {
            user: user
        });
    });
});

router.get("/editProfile", function(req, res) {
        Member.findOne({
            '_id': req.session.passport.user
        }, function(err, user) {
            if (err) return res.json(err);
            res.render("editProfile", {
                user: user
            });
        });
    })
    .post("/editProfile", isLoggedIn, upload.single('picture'), function(req, res) {
        var profilePicture = {};
        if (req.file) {
            profilePicture = {
                binaryData: req.file.buffer,
                contentType: req.file.mimetype
            };
        };
        console.log(profilePicture);
        Member.findOneAndUpdate({
                '_id': req.params.id
            }, {
                $set: {
                    'name': req.body.name,
                    'picture': profilePicture
                }
            },
            function(err, link) {
                if (err) return done(err);
                console.log("findOneAndUpdate");
            }
        );
        res.redirect('/');
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
