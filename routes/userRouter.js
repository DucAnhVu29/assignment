const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const auth = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/auth');

const userController = require('../controllers/userController');

router.route('/')
   .get(userController.index)
   .post(userController.signup)

router.post('/signup', userController.signup);

router.get('/logout', userController.signout);

router.route('/login')
   .get(userController.login)
   .post(userController.signin)

router.route('/account')
   .get(ensureAuthenticated, userController.dashboard)

router.route('/edit-account')
   .get(ensureAuthenticated, userController.getEditUser)
   .post(ensureAuthenticated, userController.postEditUser)
// console.log("🚀 ~ file: userRouter.js:21 ~ ensureAuthenticated:", ensureAuthenticated)

router.route('/users-list')
   .get(verifyAdmin, userController.getUsersList)

module.exports = router;
