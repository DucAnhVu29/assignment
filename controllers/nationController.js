const Nation = require('../models/nation');
const Player = require('../models/player');
const Countries = require('../storage/countries');

// fetch data from api https://api.first.org/data/v1/countries
// const fetch = require('node-fetch');


exports.getNations = (req, res, next) => {

	let { page } = req.query;
	if (!page || page < 1) {
		page = 1;
	}

	let size = 10;

	const limit = 10;
	const skip = (page - 1) * size;

	Nation.countDocuments().then((total) => {

		let pageAmount = Math.ceil(total / size);

		Nation.find().skip(skip).limit(limit).then((nations) => {
			res.render('nations/nations', {
				nations: nations,
				countries: Countries,
				currentPage: page,
				pageAmount: pageAmount,
				pageTitle: 'All Nations',
				path: '/nations',
				session: req.session,
			});
		})
			.catch((err) => {
				console.log(err);
				res.end('Error');
			});
	});
};

exports.getNationById = (req, res, next) => {
	Nation.find()
		.then((nations) => {
			var description = "This is the description for the nation."
			Player.find({ nation: req.params.nationId }).then(players => {
				description = "There is " + players.length + " players participated in this Tournament."

			});
			Nation.findById(req.params.nationId).then((nation) => {
				res.render('nations/nation-detail', {
					pageTitle: nation.name,
					path: `/nations/${nation.id}`,
					nations: nations,
					nation: nation,
					description: description,
					session: req.session,
				});
			});
		})
		.catch((err) => {
			console.log(err);
			res.end('Error');
		});
};

exports.getAddNation = (req, res, next) => {
	Nation.find()
		.then((nations) => {
			res.render('nations/add-nation', {
				pageTitle: 'Add Nation',
				path: `/nations/add-nation`,
				nations: nations,
				countries: Countries,
				session: req.session,
			});
		})
		.catch((err) => {
			console.log(err);
			res.end('Error');
		});
};

exports.postAddNation = (req, res, next) => {
	console.log(req.body);
	let newNation = new Nation({
		name: req.body.name,
		code: req.body.code,
		description: "There is 0 players participated in this Tournament.",
		imageUrl: "https://flagcdn.com/" + req.body.code.toLowerCase() + ".svg",
	});
	newNation.save().then((doc) => {
		res.redirect('/nations');
	});
};

// exports.deleteRemoveAllNations = (req, res, next) => {
// 	res.redirect('/nations');
// };

exports.getEditNation = (req, res, next) => {
	Nation.find()
		.then((nations) => {
			Nation.findById(req.params.nationId).then((nation) => {
				res.render('nations/edit-nation', {
					pageTitle: nation.name,
					path: `/nations/edit-nation/${nation.id}`,
					nations: nations,
					nation: nation,
					session: req.session,
				});
			});
		})
		.catch((err) => {
			console.log(err);
			res.end('Error');
		});
};

exports.postEditNation = (req, res, next) => {

	Nation.findOne({ name: req.body.name }).then(nation => {
		if (nation) {
			req.flash('error_msg', 'Nation already exists!');
			res.redirect(`/nations/edit-nation/${req.params.nationId}`);
		} else {
			Nation.findById(req.params.nationId)
				.then((nation) => {
					nation.name = req.body.name;
					nation.code = req.body.code;
					nation.imageUrl = "https://countryflagsapi.com/svg/" + req.body.code;

					nation.save().then((doc) => {
						console.log(doc);
						res.redirect(`/nations/${nation.id}`);
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});
};

exports.postRemoveNation = (req, res, next) => {

	Player.find({ nation: req.params.nationId }).then(players => {
		if (players.length > 0) {
			req.flash('error_msg', 'You cannot delete a nation that has players!');
			console.log("🚀 ~ file: nationController.js:151 ~ Player.find ~ req.flash:", req.flash)
			res.redirect(`/nations/${req.params.nationId}`);
		} else {
			Nation.findById(req.params.nationId)
				.remove()
				.then((doc) => {
					console.log(doc);
					res.redirect('/nations');
				});
		}
	});
};

