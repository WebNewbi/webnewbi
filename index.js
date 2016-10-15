var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var crypto = require("crypto");


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
    secret: 'sadfklsadjfasd',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: false, //don't save session if unmodified
    saveUninitialized: false,
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default

}));

// routes
app.use("/", require("./routes/home"));

// Port setting
app.listen(3000, function() {
    console.log("server on");
});
