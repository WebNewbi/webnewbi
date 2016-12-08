var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var morgan = require('morgan');
var path = require('path');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var crypto = require("crypto");
var Member = require("./models/members");
var UserProfile = require("./public/module/userprofile");
var flash = require('connect-flash');

var app = express();

// DB setting
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function() {
    console.log("DB connected");
});

db.on("error", function(err) {
    console.log("DB ERROR : ", err);
});

app.set("view engine", "ejs");

app.use(morgan('dev'));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(methodOverride("_method"));

// session
app.use(session({
    secret: 'sadfklsadjfasd',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: false, //don't save session if unmodified
    saveUninitialized: false,
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default

}));

// function
var createSession = function createSession() {
    return function(req, res, next) {
        if (!req.session.login) {
            req.session.login = 'logout';
        }

        next();
    };
};

app.use(createSession());
app.use(flash());

var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(UserProfile);

app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use("/", require("./routes/home"));
app.use("/login", require("./routes/login"));
app.use("/schedule", require("./routes/schedule"));

// Port setting
app.listen(3000, function() {
    console.log("server on");
});
