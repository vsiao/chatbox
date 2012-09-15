module.exports = function(app, client) {
  app.get('/auth/login', function(req, res) {
    client.authenticate(function(error, client) {
      if(error) {
        return "Error.";
      }

    });
  });
}
