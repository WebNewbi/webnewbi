var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var crypto = require("crypto");
var Member = require("./models/members");

var flash = require('connect-flash');


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

app.use(session({
    secret: 'MySecret'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Member.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-login',
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            Member.findOne({
                'email': username
            }, function(err, user) {
                if (err) return done(err);

                if (!user) {
                    req.flash("username", req.body.username);
                    return done(null, false, req.flash('login error', 'no user found'));
                }

                if (!user.authenticate(password)) {
                    req.flash("username", req.body.username);
                    return done(null, false, req.flash('login error', 'Incorrect password'));
                }

                return done(null, user);
            });
        }
    ));

// routes
app.use("/", require("./routes/home"));

// Port setting
app.listen(3000, function() {
    console.log("server on");
});
