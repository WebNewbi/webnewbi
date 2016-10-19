var passport = require('passport');
var User = require('../models/members');


var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


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
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({
                'local.email': email
            }, function(err, user) {
                if (err) return done(err);

                if (!user) {
                    req.flash("email", req.body.email);
                    return done(null, false, req.flash('loginError', 'No user found.'));
                }

                if (!user.authenticate(password)) {
                    req.flash("email", req.body.email);
                    return done(null, false, req.flash('loginError', 'Password does not Match.'));
                }

                req.flash('postsMessage', 'Welcome ' + user.nickname + '!');
                return done(null, user);
            });
        }
    )
);

passport.use(new FacebookStrategy({
    clientID: '783257915147716',//process.env.CLIENT_ID,
    clientSecret: '450a7d3ae9d4ec901a56764e09f362ad',//process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
      if (err) return done(err);

      // if the user is found, then log them in
      if (user) {
          return done(null, user); // user found, return that user
      } else {
          // if there is no user found with that facebook id, create them
          var newUser            = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = accessToken; // we will save the token that facebook provides to the user
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


  passport.use(new GoogleStrategy({
        clientID: '966622929148-22jointu1o40re7eebui79l2hfabfoj3.apps.googleusercontent.com',
        clientSecret: '92jJ6u4H81wlwBeVDjic-RBG',
        callbackURL: 'http://127.0.0.1:3000/auth/google',

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();

                    // set all of the relevant information
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));


module.exports = passport;
