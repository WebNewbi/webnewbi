var express = require('express');
var Member = require("../models/members");
var Schedule = require("../models/schedule");

var router = express.Router();


router.get("/", function(req, res) {
    Schedule.find({}, function(err, travels) {
        if (err) return res.json(err);
        res.render("index", {
            travels: travels, searchResult : false
        });
    });
});

router.get("/mySchedule", function(req, res) {
    Schedule.find({
        'ownerId': req.session.id
    }, function(err, travels) {
        if (err) return res.json(err);
        res.render("mySchedule", {
            travels: travels,
        });
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

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
