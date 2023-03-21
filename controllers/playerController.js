const Player = require('../models/player');
const Nation = require('../models/nation');

let positionData = [
	{ id: "1", name: "LS" },
	{ id: "2", name: "CF" },
	{ id: "3", name: "RS" },
	{ id: "4", name: "LW" },
	{ id: "5", name: "SS" },
	{ id: "6", name: "RW" },
	{ id: "7", name: "LAM" },
	{ id: "8", name: "CAM" },
	{ id: "9", name: "RAM" },
	{ id: "10", name: "LM" },
	{ id: "11", name: "LCM" },
	{ id: "12", name: "CM" },
	{ id: "13", name: "RCM" },
	{ id: "14", name: "RM" },
	{ id: "15", name: "LDM" },
	{ id: "16", name: "RDM" },
	{ id: "17", name: "LWB" },
	{ id: "18", name: "RWB" },
	{ id: "19", name: "LB" },
	{ id: "20", name: "LCB" },
	{ id: "21", name: "CB" },
	{ id: "22", name: "RCB" },
	{ id: "23", name: "RB" },
	{ id: "24", name: "SW" },
	{ id: "25", name: "GK" },
];

let clubData = [
	{ id: "1", name: "Arsenal" },
	{ id: "2", name: "Manchester United" },
	{ id: "3", name: "Chelsea" },
	{ id: "4", name: "Manchester City" },
	{ id: "5", name: "PSG" },
	{ id: "6", name: "Inter Milan" },
	{ id: "7", name: "Real Madrid" },
	{ id: "8", name: "Barcelona" },
];

exports.getPlayers = (req, res, next) => {

	let { page } = req.query;
	if (!page || page < 1) {
		page = 1;
	}

	let size = 6;

	const limit = 6;
	const skip = (page - 1) * size;

	Nation.find().then((nations) => {
		Player.countDocuments().then((total) => {
			Player.find().skip(skip).limit(limit).then((players) => {

				let pageAmount = Math.ceil(total / size);

				res.render('players/players', {
					path: '/players',
					pageTitle: 'Players List',
					session: req.session,
					nations: nations,
					positions: positionData,
					currentPage: page,
					pageAmount: pageAmount,
					clubs: clubData,
					players: players,
					clubchossen: "",
					nationchossen: "",
					positionchossen: "",
					isCaptain: "",
				});
			});
		});
	});
};

exports.getAddPlayer = (req, res, next) => {
	Nation.find()
		.then((nations) => {
			res.render('players/add-player', {
				path: `/players/add-player`,
				pageTitle: 'Add player',
				nations: nations,
				positions: positionData,
				clubs: clubData,
				session: req.session,
			});
		})
		.catch((err) => {
			console.log(err);
			res.end('Error');
		});
};

exports.postAddPlayer = (req, res, next) => {
	let newPlayer = new Player();
	newPlayer.name = req.body.name;
	newPlayer.imageUrl = req.body.imageUrl;
	newPlayer.club = req.body.club;
	newPlayer.isCaptain = req.body.isCaptain == 'true';
	newPlayer.nation = req.body.nation;
	console.log("🚀 ~ file: playerController.js:79 ~ req.body.nation:", req.body.nation)
	newPlayer.position = req.body.position;
	newPlayer.goals = +req.body.goals;
	newPlayer.save();

	Nation.findById(req.body.nation).then((nation) => {
		nation.players.push(newPlayer._id);
		console.log(typeof (nation.players));
		var countPlayers = 0;
		for (const key in nation.players) {
			countPlayers++;
		}
		console.log("🚀 ~ file: playerController.js:93 ~ Nation.findById ~ countPlayers:", countPlayers)
		nation.description = "There is " + countPlayers + " players participated in this Tournament."
		nation.save();
	});

	Nation.find().then((nations) => {
		Player.find().then((players) => {
			res.render('players/players', {
				path: '/players',
				pageTitle: 'Players List',
				session: req.session,
				nations: nations,
				clubs: clubData,
				players: players,
			});
		});
	});
};

exports.getPlayerById = (req, res, next) => {
	Player.findById(req.params.playerId).then((player) => {
		Nation.findById(player.nation).then((nation) => {
			console.log(player);
			console.log(player.nation);
			res.render('players/player-detail', {
				path: `/players/${req.params.playerId}`,
				pageTitle: player.name,
				player: player,
				nation: nation,
				session: req.session,
			});
		});
	});
};

exports.getEditPlayer = (req, res, next) => {
	Nation.find()
		.then((nations) => {
			Player.findById(req.params.playerId).then((player) => {
				res.render('players/edit-player', {
					path: `/players/edit-player/${req.params.playerId}`,
					pageTitle: player.name,
					player: player,
					nations: nations,
					positions: positionData,
					clubs: clubData,
					session: req.session,
				});
			})
		}).catch((err) => {
			console.log(err);
			res.end('Error');
		});
}

exports.postEditPlayer = (req, res, next) => {
	Player.findById(req.params.playerId).then((player) => {
		player.name = req.body.name;
		player.imageUrl = req.body.imageUrl;
		player.club = req.body.club;
		player.nation = req.body.nation;
		player.position = req.body.position;
		player.isCaptain = req.body.isCaptain == 'true';
		player.goals = +req.body.goals;

		player.save();

		res.redirect(`/players/${player.id}`);
	});
};

exports.postRemovePlayer = (req, res, next) => {

	Player.findById(req.params.playerId).then((player) => {
		Nation.findById(player.nation).then((nation) => {
			nation.players.pull(player._id);
			nation.save();
		});
		player.delete();
		res.redirect('/players');
	});
};

exports.getFilterPlayers = (req, res, next) => {

	let nation = req.param.nation;
	console.log("🚀 ~ file: playerController.js:170 ~ nation:", nation)
	let club = req.param.club;
	console.log("🚀 ~ file: playerController.js:172 ~ club:", club)
	let isCaptain = req.param.isCaptain;
	console.log("🚀 ~ file: playerController.js:174 ~ isCaptain:", isCaptain)

	if (nation == "all" || club == "all") {
		res.redirect('/players');
		return;
	} else if (nation == "all" && isCaptain == "true" || club == "all" && isCaptain == "true") {
		Player.find({ isCaptain: true }).then((players) => {
			res.render('players/players', {
				path: '/players',
				pageTitle: 'Players List',
				session: req.session,
				nations: nationData,
				clubs: clubData,
				players: players,
			});
		});
	}
};
