var Schedule = require("../../models/schedule");
var Geocode = require("../../models/geocode");
var Links = require("../../models/link");
var util = {};

util.createSchedule = function(req, res) {

    var newSchedule = {
        geocode: req.body.cityCode,

        tags: req.body.tags,
        start: req.body.start,
        end: req.body.end,
        comment: req.body.comment
    };

    //   var newGeocode = { geocode : schedule.geocode, cityname : req.body.city };
    //   Geocode.create( newGeocode, function(err, geocode) {
    //   });

    var promise = Schedule.create(newSchedule, function(err, schedule) {
        if (err) return res.json(err);

        var cityLink = {
            'city.geocode': schedule.geocode
        };
        var update = {
            $setOnInsert: {
                'city.geocode': schedule.geocode
            },
            $addToSet: {
                'city.name': req.body.city,
                'links': schedule._id
            }
        };
        var option = {
            upsert: true
        };
        Links.findOneAndUpdate(cityLink, update, option, function(err, schedule) {
            if (err) return res.json(err);
        });

        /*
                    for( var tagElement in req.body.tags ){
                      var tagLink  = { tag : tagElement };
                      util.attachLink( tagLink, schedule, res );
                    }
        */
        // callback이 안와도 완료페이지로 redirect시도
    });


};

/*
util.attachLink = function( json , added, schedule, res){
  Links.findOne( json ).exec(function(err, linkSchema){
      if (err) return res.json(err);
      if (linkSchema!==null){
        util.addLink( linkSchema, schedule );
      }
      else {
        util.createLink( json, schedule, res );
      }
  });

};

util.addLink = function (linkSchema, added, schedule ){
  linkSchema.push( added );
};

util.createLink = function (json, added, schedule, res ){
    json.links = [schedule._id];
    Links.create( json, function( err, link ){
      if (err) return res.json(err);
    });
};

*/
module.exports = util;
