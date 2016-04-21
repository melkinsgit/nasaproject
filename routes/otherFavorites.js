// simple js nasaproject with Twitter Lab 12

// other Favorites js for nasaproject

var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var Favorite = require('../models/favorite.js');

router.get('/', function(req, res, next) {
	res.render('otherFavorites');
});

/* GET favorites listing. */
router.get('/', function(req, res, next) {

  Favorite.find(function(err, favoriteDocs){
	if (err) { return next(err); }
	res.render('favorites', { favorites: favoriteDocs, error: req.flash('error') });
  });
  
});

router.get('/showOtherUserFavorites', function(req, res, next) {
	console.log("we should have a username that is " + req.body.username);
	Favorite.find(function(err, favoriteDocs){
	if (err) { return next(err); }
	res.render('otherFavorites', { favorites: favoriteDocs, error: req.flash('error') });
  });
});

module.exports = router;