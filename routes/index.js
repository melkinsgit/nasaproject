var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser');


var request = require('request');
var moment = require('moment');

var baseURL = 'https://api.nasa.gov/planetary/apod' ;

/* GET home page. */
router.get('/', function(req, res){
  res.render('index', { title: 'ASTROPIX' });
});


/* GET A picture from APOD service */
router.get('/fetch_picture', function fetch_picture(req, res) {

  if (req.query["today"] ) {
    apodRequest(res, true);  //true = today's picture
  }

  else if (req.query["random"]) {
    apodRequest(res);
  }

  else {
    res.sendStatus(404)
  }
});


// Makes requests to NASA's APOD service using requestjs.
// A callback checks for errors and then calls a method to
// process the JSON and return a page to the client.
function apodRequest(res, today) {

  var queryParam = {};
  var APIKEY = process.env.APOD_API_KEY;
  console.log('the log is ' + APIKEY);

  if (today) {
    queryParam = { 'api_key' : APIKEY };
  }
  else {
    queryParam = { "api_key" : APIKEY, "date" :randomDateString() };
  }

  //Use request module to request picture from APOD service; body is JSON data
  request( {uri :baseURL, qs: queryParam} , function(error, apod_response, body){

    // 200 is OK
    if (!error && apod_response.statusCode == 200){
      //Have a response from APOD. Process and use to provide response to our client.
      apodJSON = JSON.parse(body);  // turn into JSON object
      processJSONsendResponse(res, today, apodJSON);
    }

    else {
      //Log error info to console and render generic error page.
      console.log("Error in JSON request: " + error);
      console.log(apod_response);
      console.log(body);
      res.render('apodError');
    }

  });
}


function processJSONsendResponse(res, today, apodJSON){

  //APOD includes a copyright attribute, but only if the image is under copyright.
  //Add a parameter for copyright or image credit, depending if there is a copyright holder
  //NASA's images are in the public domain so no copyright, so provide an image credit.
  if (apodJSON.hasOwnProperty("copyright")) {
    // if there's a copyring field
    apodJSON.credit = "Image credit and copyright: " + apodJSON.copyright;
  } else {
    // otherwise it's a NASA photo
    apodJSON.credit = "Image credit: NASA";
  }

  //Create the NASA link to the image's page

  // The url provided is just for the image resource itself.
  // Would also like to provide a link to the page about the image.
  //  For today's image, the link is http://apod.nasa.gov/apod/
  //  For another day's image (e.g Feb 1 2016), the link is http://apod.nasa.gov/apod/ap160201.html

  var baseURL = "http://apod.nasa.gov/apod/";

  if (today) {
    apodJSON.apodurl = baseURL;
  }
  else {  // have to recreate the about data
    var imgDate = moment(apodJSON.date);
    var filenameDate = imgDate.format("YYMMDD");
    var filename = "ap" + filenameDate + ".html";
    var url = baseURL + filename;
    apodJSON.apodurl = url;
  }

  console.log(JSON.stringify(apodJSON));  //for debugging

  res.render('image', apodJSON);
}


//APOD started on June 16th, 1995. Select a random date between
//then and yesterday.  Convert to a string in YYYY-MM-DD format.
//UNIX time milliseconds since Jan 1, 1970 - the same everywhere
//the same for everyone
function randomDateString(){

  //Create data objects for yesterday, and APOD start date
  var today = moment().subtract(1, 'days');
  var APODstart = moment('1995-06-16');

  //Convert to Unix time - milliseconds since Jan 1, 1970
  var todayUnix = today.valueOf();
  var APODstartUnix = APODstart.valueOf();

  //How many milliseconds between APOD start and now?
  var delta = todayUnix - APODstartUnix;

  //Generate a random number between 0 and (number of milliseconds between APOD start and now)
  var offset = Math.floor((Math.random() * delta));

  //Add random number to APOD start
  var randomUnix = APODstartUnix + offset;

  //And then turn this number of seconds back into a date
  var randomDate = moment(randomUnix);

  //And format this date as "YYYY-MM-DD", the format required in the
  //APOD API calls.
  var stringRandomDate = randomDate.format('YYYY-MM-DD');

  return stringRandomDate;
}

module.exports = router;
