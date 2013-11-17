var express = require('express'),
	passport = require('passport'),
	YammerStrategy = require('passport-yammer').Strategy,
	mongoose = require('mongoose'),
	_ = require('underscore');


var access_token = 'MZMggKzLsAWUTXpbhtLpiQ';
var YAMMER_CONSUMER_KEY = "jDWWRkOyMx1mh9QObsDog";
var YAMMER_CONSUMER_SECRET = "KYg0rBLjYZvEKVYjsbTaFgkVapMdgx8svKaGT5Nsl0";

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("yay! connected to mongodb");
});


// var user1 = new User({ name: 'Bob', email: 'bob@bob.com' })
// console.log(user1.name); 
// console.log(user1.email);

// Passport session setup
// To support persisten login sessions, Passport needs to be able to
// to serialize users into and deserialize users out of a session.
// Typically this will be as asimple as storing the user ID or finding
// the user ID. Without a database we just attach the whole yammer profile
// to the session
passport.serializeUser(function(user, done) {
	console.log("user: " + user.full_name);
	done(null, user);

});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

var userSchema = mongoose.Schema({
    name: String,
    email: String
})

var User = mongoose.model('User', userSchema)


// TODO we need to define these thing
passport.use(new YammerStrategy({
		clientID: YAMMER_CONSUMER_KEY,
		clientSecret: YAMMER_CONSUMER_SECRET,
		callbackURL: "http://127.0.0.1:3000/auth/yammer/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.create(profile, function(error, success) {
			if(error) {
				done(error, false);
			} 
			else {
				_.each(success, function(v, k){
					console.log(k + " : " + v);
				}) 
				console.log(success['_doc'][0]);
				//console.log(success.job_title);
				done(null, success);				
			}
		});
			
	}) // end yammer strat
);

var app = express();

app.configure(function() {
	app.use(passport.initialize());
	app.use(passport.session());
});

app.get('/auth/yammer', passport.authenticate('yammer'));

app.get('/auth/yammer/callback',
	passport.authenticate('yammer', {failureRedirect: '/login'}),
	function(req, res) {
		// successful authentication, redirect home.
		res.redirect('/');
	});

app.listen(3000);