var express = require('express'),
	passport = require('passport');

var app = express();
 
app.configure(function() {
	app.use(passport.initialize());
	app.use(passport.session());
});

app.listen(3000);