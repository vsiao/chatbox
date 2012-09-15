var application_root = __dirname;
var express    = require('express');
var cons       = require('consolidate');
var handlebars = require('handlebars');
var path       = require('path');
var dropboxdb  = require('dropboxdb');
var app        = express();

dropboxdb.connect({
  key: 'an9xqcu05kyjbir',
  secret: 'xgtmq9wcshbt7lh'
});

app.configure(function() {
  app.use(express.static(path.join(application_root, "public")));
  app.engine('html', cons.handlebars);
  app.set('views', path.join(application_root, "views"));
  app.set('view engine', 'html');
  app.set('application_root', application_root);
});

handlebars.loadPartial = function (name) {
  var partial = handlebars.partials[name];
  if (typeof partial === "string") {
    partial = handlebars.compile(partial);
    handlebars.partials[name] = partial;
  }
  return partial;
};

handlebars.registerHelper("block", function (name, options) {
  /* Look for partial by name. */
  var partial = handlebars.loadPartial(name) || options.fn;
  return partial(this, { data : options.hash });
});

require('./controllers/misc')(app, dropboxdb);
require('./controllers/api')(app, dropboxdb);

app.listen(3000);
console.log("Listening on port 3000.");
