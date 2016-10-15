var express = require('express');
var Member = require("../models/members");
var Travel = require("../models/travels");

var router = express.Router();

router.get("/", function(req, res) {
    Travel.find({}, function(err, travels) {
        if (err) return res.json(err);
        res.render("index", {
            travels: travels
        });
    });
});

router.get("/signup", function(req, res) {
    res.render("signup");
});

router.post("/signup", function(req, res) {
    Member.findOne({
        email: req.body.email
    }, function(err, member) {
        if (err)

            Member.create(req.body, function(err, member) {
            if (err) return res.json(err);
            res.redirect("/");
        });
    });
});

// Contacts - New // 8
router.get("/new", function(req, res) {
    res.render("new");
});

// Contacts - create // 9
router.post("/new", function(req, res) {
    Travel.create(req.body, function(err, travel) {
        if (err) return res.json(err);
        res.redirect("/");
    });
});

module.exports = router;
