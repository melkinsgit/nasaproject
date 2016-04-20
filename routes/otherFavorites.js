// other Favorites js for nasaproject

var express = require('express');
var router = express.Router();

var User = require('../models/user.js')

router.get('/', function(req, res, next) {
	res.render('otherFavorites');
});

router.get('/showOtherUserFavorites', function(req, res, next) {
	console.log("looking for another user");
	res.redirect('/otherFavorites');
});

module.export = router;