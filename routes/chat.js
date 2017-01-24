var express = require('express');
var Schedule = require("../models/schedule");

var router = express.Router();

router.get("/chat/:id", function(req, res) {
    Member.findOne({
        '_id': req.params.id
    }, function(err, user) {
        if (err) return res.json(err);
        res.render("chat", {
            user: user,
            myInfo: req.user
        });
    });
});


module.exports = router;
