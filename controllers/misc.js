module.exports = function(app) {
  var dropboxdb = require('dropboxdb');
  var util = require('../util');

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
        util.getChats(function(chats){
          console.log(chats)
        });
      }
    });
  });
}
