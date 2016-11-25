var mongoose = require("mongoose");

var linkSchema = mongoose.Schema({

    city: {
        geocode: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return v.length > 0;
                },
                message: '{VALUE} is empty!'
            },
        },
        name: [String]
    },
    tag: {
        type: String,
        lowercase: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: '{VALUE} is empty!'

        },
    },

    links: [String]
});

var Link = mongoose.model("link", linkSchema);

module.exports = Link;
