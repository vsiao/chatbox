var application_root = __dirname;
var express   = require('express');
var cons      = require('consolidate');
var path      = require('path');
var Dropbox   = require('dropbox');
var client    = new Dropbox.Client({
  key: "6bfefmqtp7vnsyh", secret: "85865zcxurydsaw"
});
client.authDriver(new Dropbox.Drivers.NodeServer(8191));
var app       = express();

app.configure(function() {
  app.engine('html', cons.handlebars);
  app.set('views', path.join(application_root, "views"));
  app.set('view engine', 'html');
  app.set('application_root', application_root);
});

app.get('/', function(req, res) {
  res.send("Welcome to Chatbox.");
});

require('./controllers/chats')(app);
require('./controllers/auth')(app, client);

app.listen(3000);
console.log("Listening on port 3000.");
