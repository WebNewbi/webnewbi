var Schedule = require("../../models/schedule");
var Geocode = require("../../models/geocode");
var Links = require("../../models/link");
var async = require('async');

var util = {};

util.updateSchedule = function(req, res) {

    var updateSchedule = {
        tags: req.body.tags,
        start: req.body.start,
        end: req.body.end,
        comment: req.body.comment,
    };

    var deleteTags = [];
    var insertTags = [];

    Schedule.findOneAndUpdate({
            '_id': req.params.id
        }, {
            $set: {
                'start': updateSchedule.start,
                'end': updateSchedule.end,
                'comment': updateSchedule.comment,
            }
        },
        function(err, oldSchedule) {
            if (err) return res.json(err);

            // delete tags not match old tags with req.body.tags
            for (var i = 0; i < oldSchedule.tags.length; i++) {
                if (-1 === updateSchedule.tags.indexOf(oldSchedule.tags[i])) {
                    deleteTags.push(oldSchedule.tags[i]);
                }
            }

            for (var tag in updateSchedule.tags) {
                if (-1 === oldSchedule.tags.indexOf(updateSchedule.tags[tag])) {
                    insertTags.push(updateSchedule.tags[tag]);
                }
            }
            async.series([
                    function(callback) {

                        Schedule.update({
                                '_id': req.params.id
                            }, {
                                $set: {
                                    'tags': insertTags
                                }
                            },
                            function done(err) {
                                console.log('change done');
                                if (err) return callback(err);
                                callback(null);

                            });
                    },
                    function(callback) {
                        async.eachSeries(deleteTags, function(tagElement, next) {
                                Links.update({
                                    'tag': tagElement
                                }, {
                                    "$pullall": {
                                        "links": oldSchedule.id
                                    }
                                });
                                next();
                            },
                            function done(err) {
                                console.log('delete done');
                                if (err) return callback(err);
                                callback(null);
                            });
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
                                            'links': oldSchedule.id
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
                    }
                ],
                function(err) {
                    if (err) return res.json(err);
                });

            res.redirect("/");
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
