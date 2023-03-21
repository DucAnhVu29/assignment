module.exports = {
   ensureAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) {
         // req.flash('isAuthenticated', true);
         // if (req.session.user.admin == true) {
         //    req.session.admin = true;
         // }
         return next();
      }
      req.flash('error_msg', 'Please log in first!');
      res.redirect('/users/login');
   }
}
