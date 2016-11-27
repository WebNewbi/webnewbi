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

            var emptyLinksList = [];

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
                                Links.findOneAndUpdate({
                                        'tag': tagElement
                                    }, {
                                        $pull: {
                                            links: req.params.id
                                        }
                                    }, {
                                        returnNewDocument: true
                                    },
                                    function(err, result) {
                                        if (err) return done(err);
                                        if (typeof result !== 'undefined' && result.links.length < 1) {
                                            emptyLinksList.push(result._id);
                                        }

                                        next();
                                    });
                            },
                            function done(err) {
                                console.log('delete done');
                                if (err) return callback(err);
                                callback(null);
                            });
                    },

                    function(callback) {

                        Links.remove({
                                'tag': {
                                    $in: emptyLinksList
                                }
                            },
                            function(err, schedule) {
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
        ownerId: req.session.passport.user,
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
                }, // callback1

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
                } // callback2
            ],
            function(err) {
                if (err) return res.json(err);

                res.redirect("/");
                console.log('iterating done2222');
            }); // series

    }); // create
};

util.deleteSchedule = function(req, res) {
    Schedule.findByIdAndRemove(req.body.scheduleId, function(err, schedule) {
        if (err) return res.json(err);

        Links.findByIdAndRemove({
                'links': schedule._id
            },
            function(err, schedule) {
                if (err) return done(err);
                next();
            });

    }); // findByIdAndRemove
};

util.readScheduleById = function(req, res) {
    Schedule.findById(req.body.scheduleId, function(err, schedule) {
        if (err) return res.json(err);
        // TODO with the schedule

    }); // findById
};
util.findLinkByString = function(req, res) {
    Links.find({
            "$or": [{
                "tag": {
                    "$regex": new RegExp(req.params.input, "i")
                }
            }, {
                "city.name": {
                    "$regex": new RegExp(req.params.input, "i")
                }
            }]
        },
        function(err, items) {
            if (err) return res.json(err);
            res.jsonp(items);
        });
};

util.findScheduleByString = function(req, res) {
    Links.aggregate(
        [
            // Now filter those document for the elements that match
            {
                "$match": {
                    $or: [{
                        "tag": {
                            "$regex": new RegExp(req.query.input, "i")
                        }
                    }, {
                        "city.name": {
                            "$regex": new RegExp(req.query.input, "i")
                                /*
                                  "$regex": req.query.input + '*',
                                  "$options": "i"
                                  */
                        }
                    }]
                }
            }, // or

            // Unwind to "de-normalize" the document per array element
            {
                "$unwind": "$links"
            },

            // 중복제거
            // Group back as an array with only the matching elements
            //  {
            //      "$group": {
            //          "_id": "$links", //"$_id",
            //          "links":  {"$push": "$links" },
            //      }
            //  }
        ],
        function(err, results) {
            if (err) return res.json(err);

            Schedule.populate(results, {
                path: "links"
            }, function(err, results) {
                if (err) return res.json(err);
                //res.json(results);
                res.render("index", {
                    scheduls: results,
                    searchResult: true
                });
            });

        }
    );
};


function createSearch(queries) {
    var findPost = {};
    if (queries.searchType && queries.searchText && queries.searchText.length >= 3) {
        var searchTypes = queries.searchType.toLowerCase().split(",");
        var postQueries = [];
        if (searchTypes.indexOf("title") >= 0) {
            postQueries.push({
                title: {
                    $regex: new RegExp(queries.searchText, "i")
                }
            });
        }
        if (searchTypes.indexOf("body") >= 0) {
            postQueries.push({
                body: {
                    $regex: new RegExp(queries.searchText, "i")
                }
            });
        }
        if (postQueries.length > 0) findPost = {
            $or: postQueries
        };
    }
    return {
        searchType: queries.searchType,
        searchText: queries.searchText,
        findPost: findPost
    };
}

module.exports = util;
