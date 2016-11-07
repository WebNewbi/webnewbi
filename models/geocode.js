var mongoose = require("mongoose");

var geocodeSchema = mongoose.Schema({
    geocode: {
        type: String,
        required: true,
        lowercase: true
    },

    cityname: {
      type: String,
      required : true,
      lowercase : true
    }
});

var Geocode = mongoose.model("geocode", geocodeSchema);

module.exports = Geocode;
