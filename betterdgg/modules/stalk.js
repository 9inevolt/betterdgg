/*
 * Example timestamps
 * -Unparseable
 * 07:04:05 PM
 *
 * -Oldest (CST/CDT implied)
 * 01/17/2014 01:29:41
 * 01/07/2014 14:18:47
 *
 * -Older (CST/CDT)
 * 03/07/2014 11:12:39 AM
 * 03/28/2014 10:33:26 PM
 *
 * -Interim
 * Fri Sep 05 2014 01:38:01 UTC
 *
 * -Old
 * Sep 29 06:32:38 UTC
 * Jan 01 00:26:01 UTC
 * Jan 19 21:00:51 UTC
 *
 * -Current
 * Jan 19 2015 21:16:04 UTC
 * Feb 09 2015 17:46:40 UTC
 * Feb 10 2015 02:52:31 UTC
 */
;(function(bdgg) {
    var FORMATTERS = [
        function(ts) {
            return moment.utc(ts, 'MMM DD YYYY H:mm:ss [UTC]', true);
        },
        function(ts) {
            var m = moment.utc(ts, 'MMM DD H:mm:ss [UTC]', true);
            if (m.isValid()) {
                var y = m.month() < 8 ? 2015 : 2014;
                m.year(y);
            }

            return m;
        },
        function(ts) {
            return moment.utc(ts, 'ddd MMM DD H:mm:ss [UTC]', true);
        },
        function(ts) {
            var m = moment(ts + ' -0500', [ 'MM/DD/YYYY hh:mm:ss A Z', 'MM/DD/YYYY HH:mm:ss Z' ], true);
            if (m.isValid()) {
                if (m.isBefore('2014-03-09 02:00-0600') || m.isAfter('2014-11-02 02:00-0500')) {
                    m.add(1, 'hours');
                }
            }

            return m;
        }
    ];

    function _parseTime(ts) {
        var time;
        for (var i=0; i<FORMATTERS.length; i++) {
            time = FORMATTERS[i].apply(this, arguments);
            if (time != null && time.isValid()) {
                break;
            }
        }

        if (time == null || !time.isValid()) {
            time = moment(ts);
        }

        return time;
    };

    bdgg.stalk = (function() {
        function BDGGChatStalkMessage(message, user, timestamp) {
            ChatUserMessage.call(this, message, user, timestamp);
            this.timestampformat = 'MMM DD HH:mm:ss';
        }

        //stalk command and all supporting code. 
        function MySocket()
        {
          var ws = new WebSocket("ws://ws.overrustlelogs.net:13373/ws");
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

            var time = _parseTime(timeMatch[1]);

            var nick = nickMatch[1];
            var user = destiny.chat.users[nick];
            if (!user) {
                user = new ChatUser({ nick: nick });
            }

            msg = JSON.parse('"' + msg + '"');

            destiny.chat.gui.push(new BDGGChatStalkMessage(msg, user, time));
        }

        return {
            // For testing
            parseTime: function(ts) {
                return _parseTime(ts);
            },
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
                      querystr["Number"] = "3";
                    } else {
                      // Multi
                      var Names = [];
                      for (var i = 1; i <= nickCount; i++) {
                        Names.push(match[i]);
                      }
                      querystr["QueryType"] = "m";
                      querystr["Names"] = Names;
                      querystr["Number"] = "10";
                    }

                    if (lastIsNum) {
                      querystr["Number"] = Math.min(200, num).toString();
                    }

                    var sock = MySocket();
                    sock.onopen = function() {
                      sock.send(JSON.stringify(querystr));
                    };
                    setTimeout(function() {
                      if (sock.readyState < 2) {
                        if (nickCount > 1) {
                          PushChat("Timed out stalking multiple people.");
                        } else {
                          PushChat("Timed out stalking " + match[1]);
                        }
                        sock.close();
                      }
                    }, 5000);
                  } else if (sendstr.match(/^s(?:talk)?\s*$/)) {
                    PushChat("Command not understood.");
                    PushChat("Format: /stalk {username} {optional username} #");
                    PushChat("up to 4 usernames, # optional, /stalk alias: /s");
                  } else {
                    fnHandleCommand.apply(this, arguments);
                  } 
              };
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
