const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const autoCompleteController = require('../controllers/autoCompleteController');

router.get('/', autoCompleteController.autoCompleteCountry);
router.get('/nation', autoCompleteController.autoCompleteNation);
router.get('/player', autoCompleteController.autoCompletePlayer);

// router.get('/', userController.dashboard);

module.exports = router;