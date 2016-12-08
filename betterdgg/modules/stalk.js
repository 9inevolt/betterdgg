import { postMessage } from '../messaging';

function BDGGChatStalkMessage(message, user, timestamp) {
    ChatUserMessage.call(this, message, user, timestamp);
    if (moment().year() == moment(timestamp).year()) {
        this.timestampformat = 'MMM DD HH:mm:ss';
    } else {
        this.timestampformat = 'MMM DD YYYY HH:mm:ss';
    }
}

function PushChat(string) {
    destiny.chat.gui.push(new ChatInfoMessage(string));
}

function PushError(string) {
    destiny.chat.gui.push(new ChatErrorMessage(string));
}

// All timestamps are unixtime
function PushUserMessage(msg) {
    var time = moment.unix(msg['timestamp']);
    DoPush(msg['text'], msg['nick'], time);
}

const timeRegExp = /^\[([^\]]*)\]\s*/;
const nickRegExp = /^<?(\w+)>?: /;

function DoPush(msg, nick, time) {
    var user = destiny.chat.users[nick];
    if (!user) {
        user = new ChatUser({ nick: nick });
    }

    destiny.chat.gui.push(new BDGGChatStalkMessage(msg, user, time));
}

function doStalk(query) {
    postMessage('bdgg_stalk_request', query)
        .then(reply => {
            if (reply.Type === "s") {
                var strings = reply.Data;

                for (let s of strings) {
                    PushUserMessage(s);
                }
            } else if (reply.Type === "e") {
                PushError(`Error: ${reply.Error}`);
            }
        })
        .catch(err => {
            PushError(`Error: ${err}`);
        });
}

let stalk = {
    init: function() {
      BDGGChatStalkMessage.prototype = Object.create(ChatUserMessage.prototype);
      BDGGChatStalkMessage.prototype.constructor = BDGGChatStalkMessage;

      BDGGChatStalkMessage.prototype.wrap = function(html, css) {
          var elem = $(ChatUserMessage.prototype.wrap.call(this, html, css));
          elem.addClass('bdgg-stalk-msg');
          return elem[0].outerHTML;
      };

      BDGGChatStalkMessage.prototype.addonHtml = function() {
          return this.html();
      };

      // hook into handle command
      var fnHandleCommand = destiny.chat.handleCommand;
      destiny.chat.handleCommand = function(str) {
          var match;
          var sendstr = str.trim();
          if (match = sendstr.match(/^s(?:talk)?(?:\s+(\w+))(?:\s+(\w+))?(?:\s+(\w+))?(?:\s+(\w+))?(?:\s+(\d+))?\s*$/))
          {
            //debugger;
            var querystr = { "Session": destiny.chat.user.username };
            for (var i = 1; match[i] !== undefined; i++);
            var length = i;
            var num = Number(match[length-1]);
            var lastIsNum = !isNaN(num);
            var nickCount = length - (lastIsNum ? 2 : 1);

            if (nickCount < 1) {
              return;
            } else if (nickCount == 1) {
              // Stalk
              querystr["QueryType"] = "s";
              querystr["Name"] = match[1];
              querystr["Number"] = 3;
            } else {
              // Multi
              var Names = [];
              for (var i = 1; i <= nickCount; i++) {
                Names.push(match[i]);
              }
              querystr["QueryType"] = "m";
              querystr["Names"] = Names;
              querystr["Number"] = 10;
            }

            if (lastIsNum) {
              querystr["Number"] = Math.min(200, num);
            }

            doStalk(querystr);
          } else if (sendstr.match(/^s(?:talk)?\s*$/)) {
            PushChat("Command not understood.");
            PushChat("Format: /stalk {username} {optional username} #");
            PushChat("up to 4 usernames, # optional, /stalk alias: /s");
          } else {
            fnHandleCommand.apply(this, arguments);
          }
      };
    }
};

export default stalk;
