var Message = Backbone.Model.extend({
});

var Messages = Backbone.Collection.extend({
  comparator: function(a, b) {
    var m1 = a.get('ID');
    var m2 = b.get('ID');
    if (m1 > m2) {
      return 1;
    } else if (m1 < m2) {
      return -1;
    } else {
      return 0;
    }
  }
});

var Chat = Backbone.Model.extend({
  initialize: function(attributes) {
    this.messages = new Messages();
  },
  fetch: function() {
    var ths = this;
    $.ajax({
      type: 'GET',
      url: '/api/get/' + this.get('name') + '/all',
      error: function(jqXHR) {
        debugger;
      },
      success: function(data) {
        ths.messages.reset(data);
      }
    });
  },
  getMore: function() {
    var ths = this;
    debugger;
    $.ajax({
      type: 'GET',
      url: '/api/get/' + this.get('name') + '/since/' +
        this.messages.last().get('ID'),
      error: function(jqXHR) {
        debugger;
      },
      success: function(data) {
        ths.messages.add(data);
      }
    });
  }
});

var Chats = Backbone.Collection.extend({
  model: Chat,
  activeCid: null,
  initialize: function() {
    this.poll();
  },
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
  },
  poll: function() {
    var ths = this;
    if (this.activeCid) {
      var activeChat = this.getActive();
      if (activeChat.messages.length) {
        activeChat.getMore();
      } else {
        activeChat.fetch();
      }
    }
    setTimeout(function() {
      ths.poll();
    }, 500);
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
    this.$('.main.pane').hide();
    this.$('#addConversationPane').hide();
  },
  showChat: function(event) {
    chats.setActiveCid($(event.target).data('cid'));
    this.$('.main.pane').hide();
    this.$('#chatPane').show();
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
    this.chatViews = {};
    this.$input = this.$('#chatInput textarea');
    /* FIXME NO ACTIVE CHAT SHH */
  },
  swapChat: function(activeChat) {
    if (this.activeChat) {
      this.chatViews[this.activeChat.cid].$el.hide();
    }
    this.activeChat = activeChat;
    if (!this.chatViews.hasOwnProperty(activeChat.cid)) {
      this.chatViews[activeChat.cid] =
        new ChatsView({collection: activeChat.messages});
      this.chatViews[activeChat.cid].$el.prependTo(this.$el);
    }
    this.chatViews[activeChat.cid].$el.show();
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
          }
        });
        this.$input.val('');
      }
      event.preventDefault();
    }
  }
});

var ChatsView = Backbone.View.extend({
  tagName: 'ul',
  className: 'chats',
  template: Handlebars.compile(
    '<li class="msg">'+
    '<span class="author">{{author}}</span>'+
    '{{msg}}</li>'
  ),
  initialize: function(options) {
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.onAdd, this);
    this.render();
  },
  render: function() {
    this.$el.empty();
    this.collection.each(this.onAdd, this);
    return this;
  },
  onAdd: function(chat) {
    $(this.template({
      author: chat.get('author'),
      msg: chat.get('msg')
    })).hide().appendTo(this.$el).slideDown();
  }
});
