var Chats = Backbone.Collection;

var ChatboxApp = Backbone.View.extend({
  el: $('#chatboxApp'),
  initialize: function(options) {
    this.$('#optionsPane').append('Logged in as ' + options.name);
  }
});
