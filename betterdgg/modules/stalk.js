(function(bdgg) {
    bdgg.stalk = (function() {
        function BDGGChatStalkMessage(message, user, timestamp) {
            ChatUserMessage.call(this, message, user, timestamp);
            this.timestampformat = 'YYYY MMM DD HH:mm:ss';
        }

        function PushChat(string) {
            destiny.chat.gui.push(new ChatInfoMessage(string));
        }

        function PushError(string) {
            destiny.chat.gui.push(new ChatErrorMessage(string));
        }

        function DoPush(msg, nick, time) {
            var user = destiny.chat.users[nick];
            if (!user) {
                user = new ChatUser({ nick: nick });
            }

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

                var listener = function(e) {
                    if (window !== e.source) {
                        return;
                    }

                    //after sending the "bdgg_stalk_request", the content script get the logs for us and replies here
                    if (e.data.type === 'bdgg_stalk_reply') {

                        console.error("final debug: " + e);
                        console.error(e);
                        console.error(e.data.response);
                        var messages = e.data.response;
                        for (var i = 0; i < messages.lines.length; i++) {
                            console.error(messages.lines[i].text);
                            console.error( messages.nick);
                            console.error(moment.unix(messages.lines[i].timestamp));
                            DoPush(messages.lines[i].text, messages.nick, moment.unix(messages.lines[i].timestamp));
                        }

                    } else if (e.data.type === 'bdgg_stalk_error') {
                        PushError(e.data.error);
                    }
                };
                window.addEventListener('message', listener);

                // hook into handle command
                var fnHandleCommand = destiny.chat.handleCommand;

                destiny.chat.handleCommand = function(str) {
                    var match;
                    var sendstr = str.trim();
                    if (match = sendstr.match(/^s(?:talk)?(?:\s+(\w+))(?:\s+(\d+))?\s*$/))
                    {
                        var stalkArguments = {};

                        //if no number is specified, default to 3, otherwise take the number but cap it at 50
                        stalkArguments["lines"] = Math.min(Number(match[2]) || 3, 50);
                        stalkArguments["userName"] = match[1];

                        //the content script will listen to this message and will be able to make the request to the log servers
                        //otherwise this is not easily possbile due to cross origin policy
                        window.postMessage({type: 'bdgg_stalk_request', data: stalkArguments}, '*');

                    } else if (sendstr.match(/^(s|stalk)(\s.*?)?$/)) {
                        PushChat("Stalk Format: /stalk username [amountOfLines]");
                        PushChat("Example: '/stalk Destiny 5', '/stalk' alias is '/s'");
                    } else {
                        fnHandleCommand.apply(this, arguments);
                    }
                };
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
