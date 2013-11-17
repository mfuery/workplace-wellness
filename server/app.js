var express = require('express'),
	passport = require('passport'),
	YammerStrategy = require('passport-yammer').Strategy;


var YAMMER_CONSUMER_KEY = "jDWWRkOyMx1mh9QObsDog";
var YAMMER_CONSUMER_SECRET = "KYg0rBLjYZvEKVYjsbTaFgkVapMdgx8svKaGT5Nsl0";

// Passport session setup
// To support persisten login sessions, Passport needs to be able to
// to serialize users into and deserialize users out of a session.
// Typically this will be as asimple as storing the user ID or finding
// the user ID. Without a database we just attach the whole yammer profile
// to the session
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// TODO we need to define these thing
passport.use(new YammerStrategy({
		clientID: YAMMER_CONSUMER_KEY,
		clientSecret: YAMMER_CONSUMER_SECRET,
		callbackURL: "http://127.0.0.1:3000/auth/yammer/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() { return done(null, profile); });
	})
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