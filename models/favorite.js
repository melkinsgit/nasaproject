// favorite js model

// require returns module.exports - you require a file.js


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* bird watcher db - records types of birds, date spotted, some other info */

var favSchema = new Schema ({
	apodurl: String,
	url: String,
	title: String,
	date: Date
});

// mongoose.model turns it into a Bird object - uppercase first letter
var Favorite = mongoose.model('Favorite', favSchema);

module.exports = Favorite;