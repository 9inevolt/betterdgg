;(function(bdgg) {
    bdgg.stalk = (function() {
        function BDGGChatStalkMessage(message, user, timestamp) {
            ChatUserMessage.call(this, message, user, timestamp);
            this.timestampformat = 'MMM DD HH:mm:ss';
        }

        //stalk command and all supporting code. 
        function MySocket()
        {
          var ws = new WebSocket("ws://overrustlelogs.net:13373/ws");
          //console.log(ws.readyState);
          
          ws.onmessage = function(evt) {
            var json_data = JSON.parse(evt.data);
            
            if (json_data.Type === "s") {
              var strings = JSON.parse(json_data.Data);
              
              for (var i = 0; i < strings.length; i++) {
                PushUserMessage(strings[i]);
              }
            }
            else if (json_data.Type === "e") {
              PushError("Error: " + json_data.Error);
            }
            ws.close();
          };
          
          ws.onclose = function(evt) {
            //console.log("Connection closed.");
            //console.log("Code: " + evt.code + ", Reason: " + evt.reason);
            if (evt.code == 1005) {
              // not supposed to happen but does when we initiate close
            }
            else if (evt.code == 1006) {
              // not supposed to happen but does when nick doesn't match
              PushChat("Nick not found. Note: Nicks are case-sensitive.");
            }
            else if (evt.code > 1000 && evt.code < 1016) {
              PushError("Error stalking: Connection closed unexpectedly.");
            }
          };
          
          return ws;
        }

        function PushChat(string) {
            destiny.chat.gui.push(new ChatInfoMessage(string));
        }

        function PushError(string) {
            destiny.chat.gui.push(new ChatErrorMessage(string));
        }

        timeRegExp = /^\[([^\]]*)\]\s*/;
        nickRegExp = /^<?(\w+)>?: /;
        function PushUserMessage(msg) {
            var timeMatch = msg.match(timeRegExp);
            msg = msg.replace(timeRegExp, '');
            var nickMatch = msg.match(nickRegExp);
            msg = msg.replace(nickRegExp, '');

            if (!timeMatch || !nickMatch) {
                return;
            }

            var time = moment(timeMatch[1], 'MMM D H:mm:ss Z');
            if (!time.isValid()) {
                // Older logs are in CDT/CST and sometimes AM/PM
                time = moment(timeMatch[1] + ' -0500', [ 'MM/DD/YYYY hh:mm:ss A Z', 'MM/DD/YYYY HH:mm:ss Z' ]);
                if (time.isValid() && time.isBefore('2013-03-09 02:00-0500')) {
                    time = time.subtract(1, 'hours'); 
                }
            }

            var nick = nickMatch[1];
            var user = destiny.chat.users[nick];
            if (!user) {
                user = new ChatUser({ nick: nick });
            }

            msg = JSON.parse('"' + msg + '"');

            destiny.chat.gui.push(new BDGGChatStalkMessage(msg, user, time));
        }

        return {
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
                  var sendstr = str.trim();
                  if (match = sendstr.match(/^s(?:talk)?\s+([\w\d]+)\s*(\d+)?/)) { //matches format /stalk {name} {number of messages to stalk}
                  var sock = MySocket();
                  sock.onopen = function() {
                      sock.send( //send stalk query to backend
                      JSON.stringify({
                      "Session" : destiny.chat.user.username,
                      "QueryType" : "s",
                      "Name" : match[1],
                      "Number" : ((typeof match[2] === 'undefined')? "3" :match[2]) //default to 3 lines if unspecified.
                  }));
                  setTimeout(function() {
                      if (sock.readyState < 2) {
                      PushChat("Timed out stalking " + match[1]);
                      sock.close();
                      }
                    }, 5000);
                  };
                  } else if (sendstr.match(/^s(?:talk)?\s*$/)) {
                    PushChat("Command not understood. Format: /stalk {username} #");
                    PushChat("# optional, /stalk alias: /s");
                  } else if (match = sendstr.match(/^m(?:ulti)?\s+([\w\d]+)\s*([\w\d]+)?\s*([\w\d]+)?\s*([\w\d]+)?\s*(\d{1,3})?\s*$/)) { //matches format /multi {name}(up to 4) #
                        var querystr = {"Session": destiny.chat.user.username,
                                        "QueryType": "m",
                                        };
                        for (var i = 1; match[i] !== undefined; i++);
                
                        var Names = [];
                        if (/^\d+$/.test(match[i-1])) {  //if last argument is integer, set n. otherwise, n is default (10)
                          n = match[i-1];
                        } else {
                          n = "10";
                          Names.push(match[i-1]);
                        }
                
                        for (var j = 1; j < i-1; j++) {
                          Names.push(match[j]);
                        }
                
                        querystr["Names"] = Names;
                        querystr["Number"] = n;
                        
                        var sock = MySocket();
                        sock.onopen = function() {
                          sock.send( //send stalk query to backend
                            JSON.stringify(querystr));
                        setTimeout(function() {
                            if (sock.readyState < 2) {
                            PushChat("Timed out stalking multiple people.");
                            sock.close();
                            }
                          }, 5000);
                        };
                  } else if (sendstr.match(/^m(?:ulti)?\s*$/)) {
                    PushChat("Command not understood.");
                    PushChat("Format: /multi {username} {username} #");
                    PushChat("up to 4 usernames, # optional, alias: /m");
                  } else {
                    fnHandleCommand.apply(this, arguments);
                  } 
              };
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
