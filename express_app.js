var express = 	require('express'),
	passport =  require('passport');

var app = express();
 
app.listen(3000);

app.get('/', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.send(body);
});

console.log("hello world");