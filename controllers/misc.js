module.exports = function(app) {
  var dropboxdb = require('dropboxdb');
  var util = require('../util');
  var _ = require('lodash');

  app.get('/', function(req, res) {
    dropboxdb.authenticate(function(error) {
      if (error) {
        res.render('index', {msg: 'You\'re a fuck up.'});
      } else {
        dropboxdb.create("phones", {}, function(){});
        dropboxdb.userInfo(function(userInfo) {
          util.getChats(function(chats){
            var data = userInfo;
            data.chats = JSON.stringify(_.map(chats, function(chatName) {
              return { name: chatName };
            }));
            res.render('app', data);
          });
        });
      }
    });
  });
}
