module.exports = function(app) {
  var dropboxdb = require('dropboxdb');

  var chatsTable = "chatbox-";
  var name;
  var email;

  app.post('/api/send', function(req, res) {
    dropboxdb.userInfo(function(userInfo) {
      name = userInfo['name'];
      email = userInfo['email'];
      dropboxdb.insert(
        chatsTable + req.body.chatName, 
        {author: name, msg: req.body.msg},
        function(err, stat){
          console.log("CALLBACK!");
          res.send({status: 200, data: stat});
        }  
      );
    });
  });

  /* Gets all chats */
  app.get('/api/get/:name/all', function(req, res) {
    dropboxdb.find(
      chatsTable + req.params.name,
      function(row) { return true },
      function(lines) { res.send(lines) }
    );
  });

  /* Gets chats since the id*/
  app.get('/api/get/:name/since/:id', function(req, res) {
    dropboxdb.find(
      chatsTable + req.params.name,
      function(row) { return row['ID'] > req.params.id },
      function(lines) { res.send(lines) }
    );
  });

  /** Creates a new chat */
  app.post('/api/create', function(req, res) {
    dropboxdb.create(
      chatsTable + req.body.name,
      null,
      function() {}
    );
    res.send({status: 200, data: {
      name: req.body.name
      /* TODO give permalink back here */
    }});
  });
}
