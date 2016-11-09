var mongoose = require("mongoose");

var linkSchema = mongoose.Schema({
<<<<<<< HEAD
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
=======
  city : { geocode : {
                type : String,
                 required : true,
                 validate: {
                      validator: function(v) {
                        return v.length > 0;
                      },
                      message: '{VALUE} is empty!'
                    },},
            name :  [String]
          },
  tag : {
      type : String,
      lowercase: true,
      validate: {
          validator: function(v) {
            return v.length > 0;
          },
          message: '{VALUE} is empty!'
>>>>>>> e9c971d956d365e38c281a7050610c11d013ab69
        },
    },

    links: [String]
});

var Link = mongoose.model("link", linkSchema);

module.exports = Link;
