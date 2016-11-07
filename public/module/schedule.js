var Schedule = require("../../models/schedule");
var Geocode = require("../../models/geocode");
var Links = require("../../models/link");
var async = require('async');

var util = {};

util.createSchedule = function(req, res) {

    var newSchedule = {
        geocode: req.body.cityCode,

        tags: req.body.tags,
        start: req.body.start,
        end: req.body.end,
        comment: req.body.comment,
    };

    var promise = Schedule.create(newSchedule, function(err, schedule) {
        if (err) return res.json(err);


        var option = {
            upsert: true
        };

        var cityLink = {
            'city.geocode': req.body.cityCode
        };

        var update = {
            $setOnInsert: {
                'city.geocode': req.body.cityCode
            },
            $addToSet: {
                'city.name': req.body.city,
                'links': schedule._id
            }
        };
        
        async.series([
                function(callback) {
                    async.eachSeries(req.body.tags, function(tagElement, next) {
                        var tagLink = {
                            'tag': tagElement
                        };
                        var updateTag = {
                            $setOnInsert: {
                                'tag': tagElement
                            },
                            $addToSet: {
                                'links': schedule._id
                            }
                        };
                        Links.findOneAndUpdate(tagLink, updateTag, option, function(err, schedule) {
                            if (err) return done(err);

                            next();
                        });
                    }, function done(err, results) {
                        console.log('iterating done');
                        if (err) return callback(err);
                        callback(null);
                    })
                },

                function(callback) {
                    Links.findOneAndUpdate(cityLink, update, option, function(err, schedule) {
                        if (err) return callback(err);
                        callback(null);
                    });
                }
            ],
            function(err, results) {
                if (err) return res.json(err);

                res.redirect("/");
                console.log( err);
                console.log('iterating done2222');
            });

    });


};

module.exports = util;
