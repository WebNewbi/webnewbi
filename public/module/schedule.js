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

        async.series([
                function(callback) {
                    async.eachSeries(req.body.tags, function(tagElement, next) {
                        Links.findOneAndUpdate({
                                'tag': tagElement
                            }, {
                                $setOnInsert: {
                                    'tag': tagElement
                                },
                                $addToSet: {
                                    'links': schedule._id
                                }
                            }, {
                                upsert: true
                            },
                            function(err, schedule) {
                                if (err) return done(err);
                                next();
                            });
                    }, function done(err) {
                        console.log('iterating done');
                        if (err) return callback(err);
                        callback(null);
                    })
                },

                function(callback) {
                    Links.findOneAndUpdate({
                            'city.geocode': req.body.cityCode
                        }, {
                            $setOnInsert: {
                                'city.geocode': req.body.cityCode
                            },
                            $addToSet: {
                                'city.name': req.body.city,
                                'links': schedule._id
                            }
                        }, {
                            upsert: true
                        },
                        function(err, schedule) {
                            if (err) return callback(err);
                            callback(null);
                        });
                }
            ],
            function(err) {
                if (err) return res.json(err);

                res.redirect("/");
                console.log(results);
                console.log('iterating done2222');
            });

    });


};

module.exports = util;
