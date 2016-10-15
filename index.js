var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var crypto = require("crypto");
var session = require("express-session");


var app = express();

// DB setting
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function() {
    console.log("DB connected");
});

db.on("error", function(err) {
    console.log("DB ERROR : ", err);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));

// session
var createSession = function createSession(){
  return function( req, res, next ){
    if( !req.session.login)
    {
      req.session.login = 'logout';
    }

    next();
  };
};

app.use(session({ secret: 'keyboard cat', cookie:{} }));
app.use(createSession());

// routes
app.use("/", require("./routes/home"));

// Port setting
app.listen(3000, function() {
    console.log("server on");
});
