var mongoose = require("mongoose");

var memberSchema = mongoose.Schema({
 email:{type:String, required:true, unique:true},
 password:{}
});

var Member = mongoose.model("member", memberSchema);

module.exports = Member;
