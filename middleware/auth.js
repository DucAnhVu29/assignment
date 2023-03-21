require('dotenv').config();
var jwt = require('jsonwebtoken');
const { session } = require('passport');

exports.auth = (req, res, next) => {
   if (req.session.user == undefined) {
      req.flash('error_msg', 'Please log in first!');
      return res.redirect('/users/login');
   }
};

exports.verifyAdmin = (req, res, next) => {
   if (req.session.user == undefined) {
      req.flash('error_msg', 'Please log in first!');
      return res.redirect('/users/login');
   }
   if (req.session.user.admin != true) {
      req.session.admin = false;
      return res.redirect('/users/account');
   }
   next();
}