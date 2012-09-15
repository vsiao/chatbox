module.exports = function(app, dropboxdb) {
  var chatsTable = "chats";
  var name;
  var email;

  app.post('/api/send/:user', function(req, res) {
    dropboxdb.userInfo(function(userInfo) {
      name = userInfo['name'];
      email = userInfo['email'];
      console.log(req);
      dropboxdb.insert(
        chatsTable, 
        {from: email, to: req.params.user, msg: req.params.msg},
        function(){}  
      );
    });
  });

  /* TODO: a get that doesn't get all */
  app.get('/api/get/:user', function(req, res) {
    dropboxdb.find(
      chatsTable,
      function(row) {return row["from"] === req.params.user || row["to"] === req.params.user},
      function(lines) {res.send(lines)}
    );
  });

  /** Creates a new chat */
  app.post('/api/create', function(req, res) {
    dropboxdb.create(
      'chatbox-' + req.body.name,
      null,
      function() {}
    );
    res.send({status: 200, data: {
      name: req.body.name
      /* TODO give permalink back here */
    }});
  });
}
