var express = require('express');
var Schedule = require("../models/schedule");
var Geocode = require("../models/geocode");
var Links = require("../models/link");
var ScheduleUtil = require("../public/module/schedule");

var router = express.Router();

// new
router.get("/new", function(req, res) {
        res.render("new");
    })
    .post("/new", function(req, res) {
        ScheduleUtil.createSchedule(req, res);
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

// show mySchedule
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

// edit
router.get("/:id/edit", function(req, res) {
        Schedule.findOne({
            '_id': req.params.id
        }, function(err, travel) {
            if (err) return res.json(err);
            res.render("edit", {
                travel: travel,
            });
        });
    })
    .post("/:id/edit", function(req, res) {
        ScheduleUtil.updateSchedule(req, res);
    });

// delete

// myinfo

// search
router.get("/search/:string", function(req, res) {
    ScheduleUtil.findScheduleByString(req, res);
})

module.exports = router;
