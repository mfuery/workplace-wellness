var express = require('express'),
	passport = require('passport'),
	YammerStrategy = require('passport-yammer').Strategy,
	mongoose = require('mongoose'),
	_ = require('underscore'),
	yammer = require('yammer');


var access_token = 'MZMggKzLsAWUTXpbhtLpiQ';
var YAMMER_CONSUMER_KEY = "jDWWRkOyMx1mh9QObsDog";
var YAMMER_CONSUMER_SECRET = "KYg0rBLjYZvEKVYjsbTaFgkVapMdgx8svKaGT5Nsl0";

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("yay! connected to mongodb");
});

// Passport session setup
// To support persisten login sessions, Passport needs to be able to
// to serialize users into and deserialize users out of a session.
// Typically this will be as asimple as storing the user ID or finding
// the user ID. Without a database we just attach the whole yammer profile
// to the session
passport.serializeUser(function(user, done) {
	//console.log(user);	
	done(null, user._id);
});

passport.deserializeUser(function(obj, done) {
	User.findById(obj, function(error, user) {
		done(null, user);
	});
	
});

var userSchema = new mongoose.Schema({
    displayName: "string",
    id: "string",
    accessToken: "string"
});

var User = mongoose.model('User', userSchema);

// TODO we need to define these thing
passport.use(new YammerStrategy({
		clientID: YAMMER_CONSUMER_KEY,
		clientSecret: YAMMER_CONSUMER_SECRET,
		callbackURL: "http://127.0.0.1:3000/auth/yammer/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOneAndUpdate({ id: profile.id }, { accessToken: accessToken }, function(err, doc) {
			if(doc) {
				console.log("here's doc: " + doc);
				done(null, doc);
			}
			else {
				User.create(profile, function(error, success) {
					if(error) {
						done(error, false);
					} 
					else {
						console.log(success);
						done(null, success);				
					}
				});
			}
		});			
	}) // end yammer strat
);

var app = express();

app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'moldycheese' }));
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

app.get('/', function(req, res) {
	console.log("user: " +req.user);
	return res.send("homepage");
});

app.get('/relationships', function(req, res) {
	yammer.apiCall('GET', '/relationships.json', {access_token: access_token}, function(err, resp, body) {
		// console.log(resp);
		res.send(body);
	});
	// res.send('wait');
});

app.listen(3000);

