var mongoose = require("mongoose");

var geocodeSchema = mongoose.Schema({
    geocode: {
        type: String,
        required: true,
        lowercase: true
    },
    kr: {
        type: String
    },
    us: {
        type: String
    },
});

var Geocode = mongoose.model("geocode", geocodeSchema);

module.exports = Geocode;