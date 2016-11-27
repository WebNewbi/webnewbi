var express = require('express');
var Schedule = require("../models/schedule");
var Geocode = require("../models/geocode");
var Links = require("../models/link");
var ScheduleUtil = require("../public/module/schedule");

var router = express.Router();

// new
router.get("/new", isLoggedIn, function(req, res) {
    res.render("new");
})
.post("/new", isLoggedIn, function(req, res) {
    ScheduleUtil.createSchedule( req, res);
});

// search
router.post("/search", function(req, res) {
    Schedule.find({}, function(err, travels) {
        if (err) return res.json(err);
        res.render("index", {
            travels: travels,
        });
    });
});

// edit

// delete

// myinfo

// search
router.get("/search", function(req, res) {
    ScheduleUtil.findScheduleByString( req, res);
})

router.get("/search/:input", function(req, res) {
    ScheduleUtil.findLinkByString( req, res);
})

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
