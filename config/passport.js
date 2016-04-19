// astropix passport js

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport){
	// passport session set up - need the ability to
	// serialize (save to disk - a database) and
	// unserialize (extract from database) sessions
	
	// save user in session store
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	
	// get user by ID, from session store
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		} );
	});
	
	// sign up new user
	passport.use('local-signup', new LocalStrategy( {
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, username, password, done) {
		
		// when current event loop done call callback fn
		process.nextTick(function () {
			
			// search for user with this username
			User.findOne({'local.username': username}, function (err, user) {
				if (err){
					return done(err);
				}
				
				// check to see if username is already signed up
				if (user){
					console.log('a user with that username already exists');
					return done(null, false, req.flash('signupMessage', 'Sorry, username already taken') );
				}
				
				// else, that username is available; create a new use and save to db
				var newUser = new User();
				newUser.local.username = username;
				newUser.local.password = newUser.generateHash(password);
				
				newUser.save(function(err){
					if(err){
						throw err;
					}
					// if successfully saved, return new user object
					return done(null, newUser);
				} );  // newUser.save
				
			}  );  // newUser.findOne
			
		} );  // process.nextTick
		
	} )); // passport.use
	
	passport.use('local-login', new LocalStrategy({
      usernameField:'username',
      passwordField:'password',
      passReqToCallback : true
    },

    function(req, username, password, done){
      process.nextTick(function() {
        User.findOne({'local.username': username}, function (err, user) {

          if (err) {
            return done(err)
          }
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'User not found'))
          }
          //This method is defined in our user.js model. null here is coder errro, and false is user password entry error
          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Wrong password'));
          }

          return done(null, user);
        });
      });
    }));
};