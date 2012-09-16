var Message = Backbone.Model.extend({
});

var Messages = Backbone.Collection.extend({
  fetch: function() {
  }
});

var Chat = Backbone.Model.extend({
  initialize: function(attributes) {
    this.messages = new Messages();
  }
});

var Chats = Backbone.Collection.extend({
  model: Chat,
  activeCid: null,
  setActiveCid: function(cid) {
    if (this.activeCid) {
      this.getActive().set('active', false);
    }
    this.getByCid(cid).set('active', true);
    this.activeCid = cid;
    this.trigger('active:set', this.getActive());
  },
  getActive: function() {
    return this.getByCid(this.activeCid);
  }
});
var chats = new Chats();

var ChatboxApp = Backbone.View.extend({
  el: $('#chatboxApp'),
  events: {
    'click #addConversation': 'showAdd',
    'click #conversations a': 'showChat'
  },
  initialize: function(options) {
    this.$('#optionsPane').append('Logged in as ' + options.name);
    this.chatPane = new ChatPane({collection: chats});
    new ConversationsList({collection: chats});
    new AddConversation();
  },
  showAdd: function() {
    this.$('.main.pane').fadeOut(300);
    this.$('#addConversationPane').fadeIn(300);
  },
  showChat: function(event) {
    chats.setActiveCid($(event.target).data('cid'));
    this.$('.main.pane').fadeOut(300);
    this.$('#chatPane').stop(true, true).fadeIn(300);
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
    this.collection.on('active:set', this.setActive, this);
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
  },
  setActive: function(activeChat) {
    this.$('#conversations li').removeClass('active');
    this.$('#conversations li a[data-cid='+activeChat.cid+']')
      .closest('li').addClass('active');
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

var ChatPane = Backbone.View.extend({
  el: $('#chatPane'),
  initialize: function(options) {
    this.collection.on('active:set', this.swapChat, this);
    this.chatsViewCollection = new Messages();
    this.chatsView = new ChatsView({collection: this.chatsViewCollection});
  },
  swapChat: function(activeChat) {
    var msgs = activeChat.messages.fetch();
    this.chatsViewCollection.reset(activeChat.messages);
  }
});

var ChatsView = Backbone.View.extend({
  el: $('#chats')
});
