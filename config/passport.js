var passport      = require('passport');
var User          = require('../models/members');


var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login',
  new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err) return done(err);

        if (!user){
            req.flash("email", req.body.email);
            return done(null, false, req.flash('loginError', 'No user found.'));
        }

        if (!user.authenticate(password)){
           req.flash("email", req.body.email);
            return done(null, false, req.flash('loginError', 'Password does not Match.'));
        }

        req.flash('postsMessage', 'Welcome '+user.nickname+'!');
        return done(null, user);
      });
    }
  )
);


/*
passport.use(new FacebookStrategy({
    clientID: '783257915147716',//process.env.CLIENT_ID,
    clientSecret: '450a7d3ae9d4ec901a56764e09f362ad',//process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebook.id' :  }, function(err, user) {
      if (err) return done(err);

      // if the user is found, then log them in
      if (user) {
          return done(null, user); // user found, return that user
      } else {
          // if there is no user found with that facebook id, create them
          var newUser            = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

          // save our user to the database
          newUser.save(function(err) {
              if (err)
                  throw err;

              // if successful, return the new user
              return done(null, newUser);
          });
      }
    });

  }));
  */

module.exports = passport;
