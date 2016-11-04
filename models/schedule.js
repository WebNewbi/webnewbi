var mongoose = require("mongoose");

var scheduleSchema = mongoose.Schema({

    geocode: {
        type: String,
        required: [true,"geo code is required!"]
    },

    tags : [],

    start: {
        type: Date,
        default:Date.now,
        required:[true,"start date is required!"]
    },

    end: {
        type: Date,
        default:Date.now,
        required: [true,"end date is required!"]
    },

    comment: {
        type: String,
        required: true
    }
});

var Schedule = mongoose.model("schedule", scheduleSchema);

module.exports = Schedule;