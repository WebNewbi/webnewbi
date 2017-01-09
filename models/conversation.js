
var mongoose = require("mongoose");

var conversationSchema = mongoose.Schema({
    paritipants : [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
      }
    ]
});

var Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;
