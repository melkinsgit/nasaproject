// favorite js model

// require returns module.exports - you require a file.js


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favSchema = new Schema ({
	apodurl: String,
	url: String,
	title: String,
	date: Date
});

// mongoose.model turns it into a Favorite object - uppercase first letter
var Favorite = mongoose.model('Favorite', favSchema);

module.exports = Favorite;