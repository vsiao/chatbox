module.exports = function(app, dropboxdb) {
  app.get('/', function(req, res) {
    dropboxdb.authenticate(function(error) {
      if (error) {
        res.render('index', {msg: 'You\'re a fuck up.'});
      } else {
        dropboxdb.userInfo(function(userInfo) {
          res.render('app', userInfo);
        });
      }
    });
  });
}
