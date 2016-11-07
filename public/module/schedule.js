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

            var cityLink = { 'city.geocode' : req.body.cityCode };
            var update = { $setOnInsert : {'city.geocode' : req.body.cityCode },
                           $addToSet :
                                    { 'city.name' : req.body.city,
                                      'links' : schedule._id }};
            var option = { upsert : true };
            Links.findOneAndUpdate( cityLsink, update, option,  function(err, schedule) {
                    if (err) return res.json(err);
                  });

            for( var tagElement in req.body.tags ){
              var tagLink = { 'tag' : tagElement };
              var updateTag = { $setOnInsert : {'tag' : tagElement },
                                     $addToSet :{'links' : schedule._id }};
             Links.findOneAndUpdate(tagLink, updateTag, option, function(err, schedule) {
                                             if (err) return res.json(err);
                                           });
            }
            // callback이 안와도 완료페이지로 redirect시도
        });


};

module.exports = util;
