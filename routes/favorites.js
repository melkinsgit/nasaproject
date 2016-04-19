// favorites js

var express = require('express');
var router = express.Router();

var Favorite = require('../models/favorite.js')

/* GET favorites listing. */
router.get('/', function(req, res, next) {

  //var fav_list = {favorites : [ {'url':'a.com', 'title':'boop', 'date':'123'} ] };

  /* No longer needed because we are using DB */
  // if (req.session.fav_list === undefined) {
    // req.session.fav_list = { favorites : [] }
  // }
  console.log("getting favorites list in /favorites");
  Favorite.find(function(err, favoriteDocs){
	if (err) { return next(err); }
	res.render('favorites', { favorites: favoriteDocs, error: req.flash('error') });
  });
  
  // console.log("fav list is " + req.session.fav_list);
  // res.render('favorites', req.session.fav_list);  // gives favorites a list of favorites in json data
});


router.post('/add', function(req, res, next){

  // console.log(req)
  // console.log(req.body);

  // if(req.session.fav_list === undefined) {
    // req.session.fav_list = { favorites : [] }
  // }
  // don't need since it's all hidden
	// for (var att in req.body) {  // remove any empty forms from the req.body before they go to the db and create empty records
		// if (req.body[att] === ''){
			// delete(req.body[att]);
		// }
	// }
	
	// var date = req.body.dateSeen || Date.now();
	
	// req.body.datesSeen = [];
	// req.body.datesSeen.push(date);
	
	var newFavorite = Favorite(req.body);  // JSON object of the user input data; calling Favorite constructor
	
	newFavorite.save(function (err, savedFave) {
		if (err) { 
			if (err.name == "ValidationError"){
				req.flash('error', 'Invalid data');
				return res.redirect('/');
			}
			if (err.code == 11000){
				req.flash('error', 'A bird with that name already exists.');
				return res.redirect('/');
			}
			return next(err) ;
		}
		res.status (201);
		return res.redirect('/');
	} );


  // req.session.fav_list.favorites.push(req.body);

  res.redirect('/favorites');  //favorites page

});

module.exports = router;