var express = require('express');
var Message = require("../models/message");
var Conversation = require("../models/conversation");

var router = express.Router();

// view all chat list
router.get("/", function(req, res) {
  Conversation.find({participants : {$elemMatch:{$eq:req.session.passport.user}}})
      .populate('participants')
      .exec(function(err, conversations) {
          if (err) return res.json(err);
          if ( conversations.length === 0 )
          {
            res.render("chat", {
                conversation: conversation,
            });
          }
          else {
            Message.find( { converstationId:conversation[0]._id })
            .populate('sender')
            .exec(function(err, messages) {
                if (err) return res.json(err);
                res.json( {
                    conversation: conversation,
                    messages: messages
                });
              });
          }
      });
});

// view message with participant
router.get("/:input", function(req, res) {

  Conversation.findOneAndUpdate({  participants : [req.session.passport.user, req.query.participant]},
    {$setOnInsert: {'participants': [req.session.passport.user, req.query.participant]}},
     {upsert: true, returnNewDocument: true})
     .populate('participants')
     .exec(function(err, conversation) {
          if (err) res.json(err);

          Message.find( { converstationId:conversation._id })
          .populate('sender')
          .exec(function(err, messages) {
              if (err) return res.json(err);
              res.render("chat", {
                  conversation: conversation,
                  messages: messages
              });
            });
      });
});

// send message to participant
router.post("/send/:input", function(req, res) {

  Conversation.findOneAndUpdate({  participants : [req.session.passport.user, req.query.participant]},
    {$setOnInsert: {'participants': [req.session.passport.user, req.query.participant]}},
     {upsert: true, returnNewDocument: true})
     .populate('participants')
     .exec(function(err, conversation) {
          if (err) res.json(err);

          var newMessage = {
              sender: req.session.passport.user,
              content: 'templeate...!!',
              converstationId: conversation._id,
              createdAt:new Date()
          }

          Message.create(newMessage, function(err, message) {
              if (err) return res.json(err);


              res.redirect('/chat/participant=' + req.query.participant);
            });
 
      })
    });

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
