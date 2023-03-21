const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const { verifyAdmin } = require('../middleware/auth');

const autoCompleteController = require('../controllers/autoCompleteController');
const nationsController = require('../controllers/nationController');

// router.use('/', (req, res, next) => {
// 	res.statusCode = 202;
// 	res.setHeader('Content-Type', 'text/plain');
// 	next();
// });

router.get('/', nationsController.getNations);

router.route('/add-nation')
   .get(verifyAdmin, nationsController.getAddNation)
   .post(verifyAdmin, nationsController.postAddNation)

// router.post('/add-nation', nationsController.postAddNation);

// router.get('/add-nation', nationsController.getAddNation);

router.route('/edit-nation/:nationId')
   .get(verifyAdmin, nationsController.getEditNation)
   .post(verifyAdmin, nationsController.postEditNation)

// router.get('/edit-nation/:nationId', nationsController.getEditNation);

// router.post('/edit-nation/:nationId', nationsController.postEditNation);

router.route('/remove-nation/:nationId').post(verifyAdmin, nationsController.postRemoveNation)

// router.post('/remove-nation/:nationId', nationsController.postRemoveNation);

router.get('/:nationId', nationsController.getNationById);

// router.get('/search', nationsController.searchNationById);

module.exports = router;
