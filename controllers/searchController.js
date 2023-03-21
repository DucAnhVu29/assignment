const Player = require('../models/player');
const Nation = require('../models/nation');

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

exports.searchNation = (req, res, next) => {
   console.log("🚀 ~ file: nationController.js:146 ~ req.body:", req.body)
   console.log("🚀 ~ file: nationController.js:146 ~ req.query:", req.query)
   if (!req.query.nationId && !req.query.nationName) {
      return res.redirect('/nations');
   }
   if (req.query.nationId) {
      Nation.find()
         .then((nations) => {
            Nation.findById(req.query.nationId).then((nation) => {
               if (!nation) {
                  req.flash('error_msg', 'Nation not found');
                  return res.redirect('/nations');
               }
               while (nations.length > 0) {
                  nations.pop();
               }
               nations.push(nation);
               console.log("🚀 ~ file: nationController.js:157 ~ Nation.findById ~ nation:", nation)
               res.render('nations/nations', {
                  pageTitle: "Nations",
                  path: `/nations`,
                  nations: nations,
                  session: req.session,
               });
            });
         })
         .catch((err) => {
            console.log(err);
            res.end('Error');
         });
   } else {
      Nation.find()
         .then((nations) => {
            const results = [];
            nations.forEach((nation) => {
               if (nation.name.toLowerCase().indexOf(req.query.nationName.toLowerCase()) != -1) {
                  results.push(nation);
               }
            });
            console.log(typeof results);
            console.log(results);
            if (results.length == 0) {
               req.flash('error_msg', 'Nation not found');
               return res.redirect('/nations');
            }
            res.render('nations/nations', {
               pageTitle: "Nations",
               path: `/nations`,
               nations: results,
               session: req.session,
            });
         })
         .catch((err) => {
            console.log(err);
            res.end('Error');
         });
   }
}

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



exports.getFilterPlayers = (req, res, next) => {

   let { page } = req.query;
   if (!page || page < 1) {
      page = 1;
   }

   let size = 6;

   const limit = 6;
   const skip = (page - 1) * size;

   let pageAmount;

   let nation = req.query.nation;
   console.log("🚀 ~ file: playerController.js:170 ~ nation:", nation)
   let club = req.query.club;
   console.log("🚀 ~ file: playerController.js:172 ~ club:", club)
   let isCaptain = req.query.isCaptain;
   console.log("🚀 ~ file: playerController.js:174 ~ isCaptain:", isCaptain)
   let position = req.query.position;
   console.log("🚀 ~ file: searchController.js:126 ~ position:", position)

   Nation.find().then((nations) => {
      Player.find().then((players) => {

         if (club != 'all') {
            players = players.filter((player) => player.club == club);
         }

         if (nation != 'all') {
            players = players.filter((player) => player.nation == nation);
         }

         if (position != 'all') {
            players = players.filter((player) => player.position == position);
         }

         if (isCaptain != undefined) {
            players = players.filter((player) => player.isCaptain == true);
         }

         res.render('players/players', {
            pageTitle: "Players",
            path: `/players`,
            players: players,
            session: req.session,
            clubs: clubData,
            nations: nations,
            positions: positionData,
            pageAmount: pageAmount,
            currentPage: page,
            clubchossen: club,
            nationchossen: nation,
            positionchossen: position,
            isCaptain: isCaptain,
         });

      });
   });
}