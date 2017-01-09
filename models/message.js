
var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({

    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: true
    },

    content: String,
    createdAt:  {type : Date, default: Date.Now, required: true },
    converstationId: {
      type: mongoose.Schema.ObjectId,
      ref: 'conversation',
      required: true
    }
});


var Message = mongoose.model("message", messageSchema);

module.exports = Message;
