module.exports = function(app) {
  app.get('/chats', function(req, res) {
    var data = {
      message: "CHAT"
    };
    res.render('chats/display', data); 
  });
};
