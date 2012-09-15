var application_root = __dirname,
express   = require('express'),
cons      = require('consolidate'),
path      = require('path');
var app = express();

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

app.listen(3000);
console.log("Listening on port 3000.");
