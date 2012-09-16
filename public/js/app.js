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
    this.name = options.name;
    this.$('#optionsPane').append('Logged in as ' + options.name);
    this.chatPane = new ChatPane({collection: chats, name: this.name});
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

var _KEY_ENTER = 13;
var ChatPane = Backbone.View.extend({
  el: $('#chatPane'),
  events: {
    'keydown #chatInput textarea': 'onKeyDown'
  },
  initialize: function(options) {
    this.author = options.name;
    this.collection.on('active:set', this.swapChat, this);
    this.chatsViewCollection = new Messages();
    this.chatsView = new ChatsView({collection: this.chatsViewCollection});
    this.$input = this.$('#chatInput textarea');
    /* FIXME NO ACTIVE CHAT SHH */
  },
  swapChat: function(activeChat) {
    this.chatsViewCollection.reset();
    this.activeChat = activeChat;
    var msgs = activeChat.messages.fetch(function(msgs) {
      this.chatsViewCollection.reset(msgs);
    });
  },
  onKeyDown: function(event) {
    if (!this.activeChat) {
      /* TODO: delete this when you fix no activechat view */
      return;
    }
    if (event.which === _KEY_ENTER) {
      var val = this.$input.val();
      if (val !== '') {
        $.ajax({
          type: 'POST',
          url: '/api/send',
          data: {
            author: this.author,
            chatName: this.activeChat.get('name'),
            msg: val
          },
          error: function() { debugger; },
          success: function(data) {
            debugger;
          }
        });
        this.$input.val('');
      }
      event.preventDefault();
    }
  }
});

var ChatsView = Backbone.View.extend({
  el: $('#chats')
});
