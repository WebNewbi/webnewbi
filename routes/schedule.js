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
        ScheduleUtil.createSchedule(req, res);
    });

// search
router.post("/search", function(req, res) {
    Schedule.find({}, function(err, scheduls) {
        if (err) return res.json(err);
        res.render("index", {
            scheduls: scheduls,
        });
    });
});

// show mySchedule

router.get("/mySchedule", isLoggedIn, function(req, res) {
    Schedule
        .find({
            'ownerId': req.session.passport.user
        })
        .populate("users")
        .exec(function(err, scheduls) {
            if (err) return res.json(err);
            res.render("mySchedule", {
                scheduls: scheduls,
            });
        });
});

// edit
router.get("/:id/edit", function(req, res) {
        Schedule.findOne({
            '_id': req.params.id
        }, function(err, schedul) {
            if (err) return res.json(err);
            res.render("edit", {
                schedul: schedul,
            });
        });
    })
    .post("/:id/edit", function(req, res) {
        ScheduleUtil.updateSchedule(req, res);
    });

// delete

// myinfo

// search
router.get("/search", function(req, res) {
    ScheduleUtil.findScheduleByString(req, res);
})

router.get("/search/:input", function(req, res) {
    ScheduleUtil.findLinkByString(req, res);
})

var multer = require('multer');
var storage = multer.memoryStorage();

router.post('/simpleupload',  multer({ storage: storage }).single('images'), function(req,res){
      console.log(req.body); //form fields
      console.log(req.file); //form files
      //res.status(204).end();

      ScheduleUtil.createSchedule(req, res);
});

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
