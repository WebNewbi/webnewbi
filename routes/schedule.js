var express = require('express');
var Schedule = require("../models/schedule");
var Geocode = require("../models/geocode");
var Links = require("../models/link");
var ScheduleUtil = require("../public/module/util");
var router = express.Router();

// new
router.get("/new", function(req, res) {
    res.render("new");
})
.post("/new", function(req, res) {
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



module.exports = router;
