var express = require('express'),
	passport = require('passport');

var app = express();
 
// TODO we need to define these thing
passport.use(new YammerStrategy({
		clientID: YAMMER_CONSUMER_KEY,
		clientSecret: YAMMER_CONSUMER_SECRET,
		callbackURL: "http://127.0.0.1:3000/auth/yammer/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({yammerId: profile.id}, function(err, user) {
			return done(err, user);
		})
	}
));

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