module.exports = function(app, dropboxdb) {
  var chatsTable = "chats";
  var name;
  var email;

  app.post('/api/send/:user', function(req, res) {
    dropboxdb.userInfo(function(userInfo) {
      name = userInfo['name'];
      email = userInfo['email'];
    });
    dropboxdb.insert(
      chatsTable, 
      {from: email, to: req.params.user, msg: req.body.msg},
      function(){});
  });

  /* TODO: a get that doesn't get all */
  app.get('/api/get/:user', function(req, res) {
    dropbox.find(
      chatsTable,
      function(row) {row["from"] === req.params.user || row["to"] === req.params.user},
      function(lines) {res.send(ok(lines))}
    );
  });


}
