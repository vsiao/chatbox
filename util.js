module.exports = (function() {
  var dropboxdb = require('dropboxdb');

  function getChats(cb) {
    dropboxdb.show(function(entries) {
      reg = /chatbox-(.+)/
      chats = entries.filter(function(collection) {return collection.match(reg)});
      chats = chats.map(function(chat){return reg.exec(chat)[1]});
      cb(chats);
    });
  }

  return {
    getChats: getChats
  };
})();
