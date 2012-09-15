var chats = new Backbone.Collection();

var ChatboxApp = Backbone.View.extend({
  el: $('#chatboxApp'),
  events: {
    'click #addConversation': 'showAdd'
  },
  initialize: function(options) {
    this.$('#optionsPane').append('Logged in as ' + options.name);
    new ConversationsList({collection: chats});
    new AddConversation();
  },
  showAdd: function() {
    this.$('.main.pane').fadeOut(300);
    this.$('#addConversationPane').fadeIn(300);
  }
});

var ConversationsList = Backbone.View.extend({
  el: $('#conversations'),
  template: Handlebars.compile(
    '{{#each conversations}}<li class="{{#if active}}active{{/if}}'+
    '"><a href="#" data-cid="{{cid}}">{{name}}</a></li>{{/each}}'
  ),
  initialize: function(options) {
    this.collection.on('reset add', this.render, this);
  },
  render: function() {
    var conversations = [];
    this.collection.each(function(chat) {
      conversations.push({
        cid: chat.cid,
        active: false,
        name: chat.get('name')
      });
    });
    this.$el.html(this.template({conversations:conversations}));
    return this;
  }
});

var AddConversation = Backbone.View.extend({
  el: $('#addConversationForm'),
  events: {
    'click input[type=submit]': 'onSubmit'
  },
  onSubmit: function() {
    $.ajax({
      type: 'POST',
      url: '/api/create',
      data: {name: this.$('#conversationNameInput').val()},
      success: function(res) {
        alert('OK. Go share it with your friends!');
        chats.add({name: res.data.name});
      }
    });
    event.preventDefault();
  }
});
