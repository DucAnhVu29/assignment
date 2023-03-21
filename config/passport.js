const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const { session } = require('passport');
require('dotenv').config();

module.exports = function (passport) {
   passport.use(
      new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
         //Match user
         User.findOne({ username: username })
            .then(user => {
               if (!user) {
                  return done(null, false, { message: 'This username is not registed' });
               }
               //Match password
               bcrypt.compare(password, user.password, (err, isMatch) => {
                  if (err) throw err;
                  if (isMatch) {
                     const token = jwt.sign(
                        { user_id: user._id, username },
                        process.env.JWT_KEY,
                        {
                           expiresIn: "2h",
                        });
                     session.token = token;
                     // console.log("🚀 ~ file: passport.js:29 ~ bcrypt.compare ~ token:", token)
                     // user.token = token;
                     // process.env.SESSION_TOKEN = token;
                     // console.log("🚀 ~ file: passport.js:29 ~ bcrypt.compare ~ process.env.SESSION_TOKEN:", process.env.SESSION_TOKEN)
                     // user.save();
                     return done(null, user);
                  }
                  else {
                     return done(null, false, { message: 'Password is incorrect' });
                  }
               })
            })
            .catch(err => console.log(err));

      })
   )
   passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      User.findById(id, (error, user) => {
         done(error, user);
      });
   });
}
