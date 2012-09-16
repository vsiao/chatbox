module.exports = (function() {
  var dropboxdb = require('dropboxdb');

  function getChats(callback) {
    dropboxdb.show(function(error, entries, dir_stat, entry_stats) {
      if (error) {
        callback(error, entries);
      } else {
        reg = /chatbox-(.+)/
        chats = entries.filter(function(collection) {return collection.match(reg)});
        chats = chats.map(function(chat){return reg.exec(chat)[1]});
        callback(error, chats);
      }
    });
  }

  return {
    getChats: getChats
  };
})();
