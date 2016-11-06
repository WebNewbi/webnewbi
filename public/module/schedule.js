var Schedule  = require("../../models/schedule");
var Geocode   = require("../../models/geocode");
var Links     = require("../../models/link");

var util = {};

util.createSchedule = function ( req, res ){

   var newSchedule = {
     geocode  : req.body.cityCode,

     tags     : req.body.tags,
     start    : req.body.start,
     end      : req.body.end,
     comment  : req.body.comment
   };

    var promise = Schedule.create(newSchedule, function(err, schedule) {
            if (err) return res.json(err);

            var geocodeLink = { geocode : schedule.geocode };
            util.attachLink( geocodeLink );

            var tagLink  = { tag : Schedule.tag };
            util.attachLink( tagLink );

            // callback이 안와도 완료페이지로 redirect시도
        });


};


util.attachLink = function( json ){
  Links.findOne( json ).exec(function(err, linkSchema){
      if (err) return res.json(err);
      if (linkSchema!==null){
        util.addLink( linkSchema );
      }
      else {
        util.createLink( json, linkSchema );
      }
  });

};

util.addLink = function (linkSchema){
  link.links.push( linkSchema._id );
};

util.createLink = function (json, linkSchema){
    json.links = [linkSchema._id];

    Links.create( json, function( err, link ){
      if (err) return res.json(err);
    });
};


module.exports = util;
