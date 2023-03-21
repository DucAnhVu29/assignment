const bcrypt = require('bcrypt');
const { path } = require('../app');
const User = require('../models/user');
const passport = require('passport');


exports.index = (req, res, next) => {
   res.render('user/signup', {
      path: '/users/signup',
      pageTitle: 'Sign Up',
      username: "",
      password: "",
      confirmpassword: "",
      name: "",
      YearOfBirth: "",
      session: req.session,
   });
}

exports.getUsersList = (req, res, next) => {
   User.find()
      .then((users) => {
         res.render('user/users-list', {
            users: users,
            pageTitle: 'Users List',
            path: '/users-list',
            session: req.session,
         });
      })
      .catch((err) => {
         console.log(err);
         res.end('Error');
      });
};

exports.signup = (req, res, next) => {
   const { username, password, confirmpassword, name, YearOfBirth } = req.body;
   let errors = [];
   if (!username || !password) {
      errors.push({ msg: 'Please enter all fields' });
   }
   if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
   }
   if (password !== confirmpassword) {
      errors.push({ msg: 'Confirm Password must be the same as password' });
   }
   if (errors.length > 0) {
      res.render('user/signup', {
         pageTitle: 'Sign Up',
         errors,
         username,
         password,
         confirmpassword,
         name,
         YearOfBirth,
         session: req.session,
      });
   }
   else {
      User.findOne({ username: username }).then(user => {
         if (user) {
            errors.push({ msg: 'Username already exists' });
            res.render('user/signup', {
               path: '/users/signup',
               pageTitle: 'Sign Up',
               errors,
               username,
               password,
               confirmpassword,
               name,
               YearOfBirth,
               session: req.session,
            });
         }
         else {
            const newUser = new User({
               username,
               password,
               name,
               YearOfBirth,
            });
            //Hash password
            bcrypt.hash(newUser.password, 10, function (err, hash) {
               if (err) throw err;
               newUser.password = hash;
               newUser.save()
                  .then(user => {
                     res.redirect('/users/login');
                  })
                  .catch(next);
            });
         }
      });
   }
}

exports.login = (req, res, next) => {
   res.render('user/login', {
      path: '/users/login',
      pageTitle: 'Login',
      session: req.session,
   })
}

exports.signin = (req, res, next) => {
   const username = req.body.username;
   req.session.user = req.user;
   req.session.tmpUsername = username;
   passport.authenticate('local', {
      successRedirect: '/users/account',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);

}

exports.dashboard = (req, res, next) => {
   req.session.checkSession = true;
   req.session.user = req.user;
   if (req.session.user.admin == true) {
      req.session.admin = true;
   }
   console.log("🚀 ~ file: userController.js:82 ~ req.session:", req.session)
   res.render('user/dashboard', {
      path: '/users/account',
      pageTitle: 'Account',
      session: req.session,
   })
}
exports.signout = (req, res, next) => {
   req.logout(function (err) {
      if (err) { return next(err); }
      process.env.SESSION_SECRET = null;
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
   });
}

exports.getEditUser = (req, res, next) => {
   User.findById(req.session.user._id).then((user) => {
      console.log("🚀 ~ file: userController.js:120 ~ user:", user)
      res.render('user/edit-user', {
         path: `/users/edit-account`,
         pageTitle: 'Edit User',
         user: user,
         oldpassword: "",
         password: "",
         confirmpassword: "",
         session: req.session,
      });
   })
}

exports.postEditUser = (req, res, next) => {
   let { username, oldpassword, password, confirmpassword, name, YearOfBirth } = req.body;
   let errors = [];

   bcrypt.compare(oldpassword, req.session.user.password, function (err, result) {
      console.log("🚀 ~ file: userController.js:197 ~ result:", result)
      if (!result) {
         errors.push({ msg: 'Old Password is not correct!' });
         res.render('user/edit-user', {
            path: `/users/edit-account`,
            pageTitle: 'Edit User',
            errors,
            oldpassword,
            username,
            user: req.session.user,
            password,
            confirmpassword,
            session: req.session,
         });
      } else {
         if (username != req.session.user.username) {
            User.findOne({ username: username }).then(user => {
               if (user) {
                  errors.push({ msg: 'Username already exists' });
                  res.render('user/edit-user', {
                     path: '/users/edit-account',
                     pageTitle: 'Edit User',
                     errors,
                     user: req.session.user,
                     username,
                     oldpassword,
                     password,
                     confirmpassword,
                     name,
                     YearOfBirth,
                     session: req.session,
                  });
               }
            })
         }

         if (password.trim() != "" && confirmpassword.trim() != "") {
            if (password.length < 6) {
               errors.push({ msg: 'Password must be at least 6 characters' });
            }
            if (password !== confirmpassword) {
               errors.push({ msg: 'Confirm Password must be the same as password' });
            }
            if (errors.length > 0) {
               res.render('user/edit-user', {
                  path: `/users/edit-account`,
                  pageTitle: 'Edit User',
                  errors,
                  oldpassword,
                  user: req.session.user,
                  password,
                  confirmpassword,
                  session: req.session,
               });
            } else {
               bcrypt.compare(password, req.session.user.password, function (err, result) {
                  console.log("🚀 ~ file: userController.js:199 ~ result:", result)
                  // console.log("🚀 ~ file: userController.js:145 ~ password:", password)
                  if (result) {
                     errors.push({ msg: 'New Password must not be the same as Old Password!' });
                     res.render('user/edit-user', {
                        path: `/users/edit-account`,
                        pageTitle: 'Edit User',
                        errors,
                        username,
                        oldpassword,
                        user: req.session.user,
                        password,
                        confirmpassword,
                        session: req.session,
                     });
                  }
                  else {
                     User.findById(req.session.user._id).then((user) => {
                        bcrypt.hash(password, 10, function (err, hash) {
                           if (err) throw err;
                           user.password = hash;
                           user.username = username;
                           user.name = name;
                           user.YearOfBirth = YearOfBirth;
                           user.save()
                              .then(user => {
                                 res.redirect('/users/account');
                              })
                              .catch(next);
                        });
                     })
                  }
               });
            }
         } else {
            User.findById(req.session.user._id).then((user) => {
               user.username = username;
               user.name = name;
               user.YearOfBirth = YearOfBirth;
               user.save()
                  .then(user => {
                     res.redirect('/users/account');
                  })
                  .catch(next);
            })
         }
      }
   });

}
