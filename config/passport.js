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

passport.use(new GoogleStrategy({

        clientID: '966622929148-22jointu1o40re7eebui79l2hfabfoj3.apps.googleusercontent.com',
        clientSecret: '92jJ6u4H81wlwBeVDjic-RBG',
        callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
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
