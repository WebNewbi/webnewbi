var mongoose = require("mongoose");
var travelSchema = mongoose.Schema({
  big:{type:String, required:true},
  small:{type:String, required:true},
  start:{type:String , required:true},
  end:{type:String, required:true},
  gender:{type:String, required:true},
  number:{type:String, required:true},
  comment:{type:String, required:true}
});
var Travel = mongoose.model("travel", travelSchema); //5

module.exports = Travel;
