module.exports = function(app) {
  app.get('/chat/', function(req, res) {
    var data = {
      message: "CHAT"
    };
    res.render('chat/display', data); 
  });
};
