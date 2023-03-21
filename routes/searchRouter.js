const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');

router.get('/nation', searchController.searchNation);

router.get('/player/filter', searchController.getFilterPlayers);


module.exports = router;
