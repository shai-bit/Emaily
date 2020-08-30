const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys'); //Keys are coming from hidden file

const User = mongoose.model('users');

// Turns the user into an id for cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Turns user id into user
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// We use this strategy with passport.authenticate
passport.use(
  new GoogleStrategy(
    {
      //important: exact syntax
      // callbackURL for when granted access
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true;
    },
    //This arguments come from googleOAuth response
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          // User exists
          done(null, existingUser);
        } else {
          // User doesn't exist/ create new
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);
