var express = require('express');
var Schedule = require("../models/schedule");
var Geocode = require("../models/geocode");
var Links = require("../models/link");
var ScheduleUtil = require("../public/module/schedule");

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
    storage: storage
});

var router = express.Router();

// show mySchedule
router.get("/my", isLoggedIn, function(req, res) {

    Schedule.find({
            'ownerId': req.user._id
        })
        .populate('ownerId')
        .exec(function(err, scheduls) {
            if (err) return res.json(err);
            res.render("mySchedule", {
                scheduls: scheduls,
            });
        });
});

// new
router.get("/new", isLoggedIn, function(req, res) {
        res.render("new");
    })
    .post("/new", isLoggedIn, upload.array('images', 10), function(req, res) {
        console.log(req.body); //form fields
        console.log(req.files); //form files
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

// show specific schedule
router.get("/:id", function(req, res) {
        Schedule.findById( req.params.id )
        .populate('comments.writer')
        .populate('ownerId')
        .exec( function(err, schedule) {
            if (err) return res.json(err);
            res.render( "viewSchedule", { schedule : schedule, user:req.user});
        });
    })
    // post comment
    .post('/comments/:id', function(req,res){
      var newComment = req.body.comment;
      newComment.writer = req.user._id;
      newComment.createdAt = new Date();

      Schedule.update({_id:req.params.id},{$push:{comments:newComment}},function(err,post){
        if(err) return res.json({success:false, message:err});
        res.redirect('/schedule/'+req.params.id);
        });
      })
      // destroy comment
      .delete('/:scheduleId/comments/:commentId', function(req,res){
          Schedule.update({_id:req.params.scheduleId},{$pull:{comments:{_id:req.params.commentId}}},
              function(err,post){
                  if(err) return res.json({success:false, message:err});
                  res.redirect('/schedule/'+req.params.scheduleId);
      });
  });

// edit
router.get("/:id/edit", function(req, res) {
        Schedule.findById(req.params.id )
        .exec( function(err, schedul) {
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

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
