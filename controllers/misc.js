module.exports = function(app) {
  var dropboxdb = require('dropboxdb');

  app.get('/', function(req, res) {
    dropboxdb.authenticate(function(error) {
      if (error) {
        res.render('index', {msg: 'You\'re a fuck up.'});
      } else {
        dropboxdb.userInfo(function(userInfo) {
          var data = userInfo;
          data.conversations = [];
          res.render('app', data);
        });
      }
    });
  });
}
