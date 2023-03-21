const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const { auth } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/auth');

const playerController = require('../controllers/playerController');

// router.use('/', (req, res, next) => {
// 	res.statusCode = 202;
// 	res.setHeader('Content-Type', 'text/plain');
// 	next();
// });

router.get('/', playerController.getPlayers);

router.route('/add-player')
   .get(verifyAdmin, playerController.getAddPlayer)
   .post(verifyAdmin, playerController.postAddPlayer)

// router.get('/add-player', playerController.getAddPlayer);

// router.post('/add-player', playerController.postAddPlayer);

router.route('/edit-player/:playerId')
   .get(verifyAdmin, playerController.getEditPlayer)
   .post(verifyAdmin, playerController.postEditPlayer)

// router.get('/edit-player/:playerId', playerController.getEditPlayer);

// router.post('/edit-player/:playerId', playerController.postEditPlayer);

router.route('/remove-player/:playerId').post(verifyAdmin, playerController.postRemovePlayer)

// router.post('/remove-player/:playerId', playerController.postRemovePlayer);

router.get('/:playerId', playerController.getPlayerById);


module.exports = router;
