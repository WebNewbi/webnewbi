var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 1
var methodOverride = require("method-override"); // 1

var app = express();

// DB setting
mongoose.connect(process.env.MONGO_DB); // 1
var db = mongoose.connection; // 2
   
db.once("open", function(){
 console.log("DB connected");
});
// 4
db.on("error", function(err){
 console.log("DB ERROR : ", err);
});

app.set("view engine","ejs");
app.use(express.static(__dirname));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({extended:true})); // 3
app.use(methodOverride("_method")); // 2

app.use("/", require("./routes/home")); //1

app.listen(3000, function(){
  console.log("server on");
});
