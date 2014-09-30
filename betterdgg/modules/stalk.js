;(function(bdgg) {
    bdgg.stalk = (function() {
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
                PushChat(strings[i]);
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

        return {
            init: function() {
                // hook into handle command
                var fnHandleCommand = destiny.chat.handleCommand;
                destiny.chat.handleCommand = function(str) {
                    var sendstr = str.trim();
                    var Regexp = /^s(?:talk)?\s+([\w\d]+)\s*(\d+)?/g;  //matches format $stalk {name} {number of messages to stalk}
                    var match = Regexp.exec(sendstr);
                    var number;
                    
                    if (match) {
                      var sock = MySocket();
                      sock.onopen = function() {
                          sock.send(   //send stalk query to backend
                            JSON.stringify({
                               "Session" :   destiny.chat.user.username,
                               "QueryType" : "s",
                               "Name" :      match[1],
                              "Number" :    ((typeof match[2] === 'undefined')? "3" :match[2])  //default to 3 lines if unspecified.
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
                        PushChat("# optional, /stalk alias: /s")
                    } else {
                      fnHandleCommand.apply(this, arguments);
                    }
                };
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
