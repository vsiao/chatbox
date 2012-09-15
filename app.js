var application_root = __dirname;
var express   = require('express');
var cons      = require('consolidate');
var path      = require('path');
var dropboxdb = require('dropboxdb');
var app       = express();

dropboxdb.connect({
  key: '6bfefmqtp7vnsyh',
  secret: '85865zcxurydsaw'
});

app.configure(function() {
  app.engine('html', cons.handlebars);
  app.set('views', path.join(application_root, "views"));
  app.set('view engine', 'html');
  app.set('application_root', application_root);
});

require('./controllers/misc')(app, dropboxdb);
require('./controllers/api')(app, dropboxdb);

app.listen(3000);
console.log("Listening on port 3000.");
