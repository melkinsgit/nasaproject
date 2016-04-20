// favorites js

var express = require('express');
var router = express.Router();

var Favorite = require('../models/favorite.js')

/* GET favorites listing. */
router.get('/', function(req, res, next) {

  Favorite.find(function(err, favoriteDocs){
	if (err) { return next(err); }
	res.render('favorites', { favorites: favoriteDocs, error: req.flash('error') });
  });
  
});


router.post('/add', function(req, res, next){
	
	var newFavorite = Favorite(req.body);  // JSON object of the user input data; calling Favorite constructor
	console.log(newFavorite);
	Favorite.find({url:newFavorite.url}, function (err, foundFave){
		if(foundFave.length == 0){
			console.log(foundFave);
			console.log("wasn't found");
			newFavorite.save(function (err, savedFave) {
				if (err) {
					return next(err);
					}
				console.log("favorite saved");
				console.log(savedFave);
				res.status (201);
				res.redirect('/favorites');  //favorites page ABSOLUTE
			});
		}
		else {
			console.log("THIS FAVORITE EXISTS");
			res.redirect('/favorites');  //favorites page ABSOLUTE
		}
	});
});

/* POST delete a favorite */
router.post('/deleteFave', function(req, res, next) {
	var faveToDelete = req.body.title;
	
	Favorite.findOneAndRemove({title:faveToDelete}, function (err, faveRemoved){
		if (err) {
				return next(err);
			}
		if (!faveRemoved) {
			return next (new Error('No favorite found with name ' + req.body.name) );
			}
		res.redirect('/favorites');  //favorites page
	});
} ); // end of delete post

module.exports = router;