var mongoose = require("mongoose");

var travelSchema = mongoose.Schema({

    big: {//list
        type: String,
        required: true
    },
    tag: {
      // list
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

var Travel = mongoose.model("travels", travelSchema);

module.exports = Travel;
