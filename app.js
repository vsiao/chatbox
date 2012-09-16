var application_root = __dirname;
var express       = require('express');
var cons          = require('consolidate');
var handlebars    = require('handlebars');
var path          = require('path');
var dropboxdb     = require('dropboxdb');
// var TwilioClient  = require('twilio').Client;
// var ACC_SID       = 'AC38d0b53961a6faa172c8b300a9fb2e9e'; 
// var AUTH_TOKEN    = 'c16bb6d833c7e6bedb74009d0eb02674';
var HOST          = 'localhost';
var sys           = require('sys');
// var client        = new TwilioClient(ACC_SID, AUTH_TOKEN, HOST);
// var Twiml         = require('twilio').Twiml;
// var phone         = client.getPhoneNumber('+16096812980');
var app           = express();

dropboxdb.connect({
  key: 'an9xqcu05kyjbir',
  secret: 'xgtmq9wcshbt7lh'
});

app.configure(function() {
  app.use(express.bodyParser());
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

// phone.setup(function(){
// phone.on('incomingSms', function(reqParams, res) {
//   console.log(reqParams);
//   dropboxdb.find("phones", 
//     function(row) {
//       return row.phone === reqParams.From;
//     }, 
//     function(rows) {
//       rows.forEach(function(row) {
//         dropboxdb.insert(
//           "chatbox-" + row.chat,
//           {author: row.name, msg: reqParams.Body},
//           function(err, stat) {
//             if(err) {
//               console.log(err);
//             }
//           }
//         );
//       });
//     }); 
// });
// });


require('./controllers/misc')(app);
require('./controllers/api')(app);
// require('./phone')(dropboxdb, phone);

app.listen(3000);
console.log("Listening on port 3000.");
