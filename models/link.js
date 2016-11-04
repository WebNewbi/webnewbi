var mongoose = require("mongoose");

var linkSchema = mongoose.Schema({
  geocode : { type : String, lowercase: true },
  tag : { type : String, lowercase: true },
  links : [String]
});

var Link = mongoose.model("link", linkSchema );

module.exports = Link;
