var mongoose = require("mongoose");

var scheduleSchema = mongoose.Schema({

    cityName: {
        type: String,
        required: [true, "geo code is required!"]
    },

    geocode: {
        type: String,
        required: [true, "geo code is required!"]
    },

    tags: [String],

    start: {
        type: Date,
        default: Date.now,
        required: [true, "start date is required!"]
    },

    end: {
        type: Date,
        default: Date.now,
        required: [true, "end date is required!"]
    },

    comment: {
        type: String,
        required: true
    },

    createdAt: {type:Date, default:Date.now},
    ownerId: {
        type: mongoose.Schema.ObjectId, ref: 'users',
        required: true
    },
  });

var Schedule = mongoose.model("schedule", scheduleSchema);

module.exports = Schedule;
