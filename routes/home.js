var express = require('express');
var Member = require("../models/members");
var Travel = require("../models/travels");

var router = express.Router();

router.get("/", function(req, res) {
  Travel.find({}, function(err, travels){
    if(err) return res.json(err);
    res.render("index", {travels:travels});
  });
});

router.get("/signin", function(req, res){
 res.render("signin");
});

router.post("/signin", function(req, res){
 Member.create(req.body, function(err, member){
  if(err) return res.json(err);
  res.redirect("/");
 });
});

router.get("/login", function(req, res){
 res.render("login");
});

router.post("/login", );

// Contacts - New // 8
router.get("/new", function(req, res){
 res.render("new");
});

// Contacts - create // 9
router.post("/new", function(req, res){
 Travel.create(req.body, function(err, travel){
  if(err) return res.json(err);
  res.redirect("/");
 });
});


// for trigger route test
var cb0 = function (req, res, next) {
  console.log('CB0');
  res.render('error', { error: err });
  var temp = false;
  if ( temp )
  {
    next();
  }
  else {
    res.send('temp is not true');
  }
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

var cb2 = function (req, res) {
  res.send('Hello from C!');
}

router.get("/hello", [cb0, cb1, cb2] );



module.exports = router;
