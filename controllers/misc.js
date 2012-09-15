module.exports = function(app, client) {
  app.get('/', function(req, res) {
    client.authenticate(function(error, client) {
      if(error) {
        return "Error.";
      }
      
    });
  });
}
