var Schedule = require("../../models/schedule");
var Geocode = require("../../models/geocode");
var Links = require("../../models/link");
var async = require('async');

var util = {};

util.updateSchedule = function(req, res) {

    var updateSchedule = {
        geocode: req.body.cityCode,

        tags: req.body.tags,
        start: req.body.start,
        end: req.body.end,
        comment: req.body.comment,
    };

    var deleteTags = [];
    var insertTags = [];
    var deleteCityGeocode = '';
    var insertCityGeocode = '';

    Schedule.findOne({
            '_id': req.body._id
        },
        function(err, oldSchedule) {
            if (err) return res.json(err);

            // delete tags not match old tags with req.body.tags
            deleteTags = oldSchedule.find({
                'tags': {
                    $not: {
                        $elemMatch: {
                            $elemMatch: {
                                $in: updateSchedule.tags
                            }
                        }
                    }
                }
            }).toArray();
            insertTags = updateSchedule.find({
                'tags': {
                    $not: {
                        $elemMatch: {
                            $elemMatch: {
                                $in: oldSchedule.tags
                            }
                        }
                    }
                }
            }).toArray();

            if (oldSchedule.city != updateSchedule.city) {
                deleteCityGeocode = oldSchedule.geocode;
                insertCityGeocode = updateSchedule.geocode;
            }
        });

    async.series([
            function(callback) {
                async.eachSeries(deleteTags, function(tagElement, next) {
                    Links.update({
                        'tag': tagElement
                    }, {
                        $pull: {
                            'links': updateSchedule._id
                        }
                    });
                    next();
                });
            },
            function done(err) {
                console.log('iterating done');
                if (err) return callback(err);
                callback(null);
            },

            function(callback) {
                async.eachSeries(insertTags, function(tagElement, next) {
                        Links.findOneAndUpdate({
                                'tag': tagElement
                            }, {
                                $setOnInsert: {
                                    'tag': tagElement
                                },
                                $addToSet: {
                                    'links': updateSchedule._id
                                }
                            }, {
                                upsert: true
                            },
                            function(err, schedule) {
                                if (err) return done(err);
                                next();
                            });
                    },
                    function done(err) {
                        console.log('iterating done');
                        if (err) return callback(err);
                        callback(null);
                    });
            },
            function(callback) {
                Links.update({
                    'city.geocode': deleteCityGeocode
                }, {
                    $pull: {
                        'links': updateSchedule._id
                    }
                });
            },

            function(callback) {
                Links.findOneAndUpdate({
                        'city.geocode': insertCityGeocode
                    }, {
                        $setOnInsert: {
                            'city.geocode': insertCityGeocode
                        },
                        $addToSet: {
                            'city.name': req.body.city,
                            'links': updateSchedule._id
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
            console.log('iterating done2222');
        });
};

util.createSchedule = function(req, res) {

    var newSchedule = {
        cityName: req.body.city,
        geocode: req.body.cityCode,

        tags: req.body.tags,
        start: req.body.start,
        end: req.body.end,
        comment: req.body.comment,
        ownerId: req.session.id,
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
                            function(err, link) {
                                if (err) return done(err);
                                next();
                            });
                    }, function done(err) {
                        console.log('iterating done');
                        if (err) return callback(err);
                        callback(null);
                    });
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
                        function(err, link) {
                            if (err) return callback(err);

                            callback(null);
                        });
                }
            ],
            function(err) {
                if (err) return res.json(err);

                res.redirect("/");
                console.log('iterating done2222');
            });

    });
};

module.exports = util;
