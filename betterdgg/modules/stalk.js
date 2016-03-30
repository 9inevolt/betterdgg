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
 * -New Old
 * Jan 19 2015 21:16:04 UTC
 * Feb 09 2015 17:46:40 UTC
 * Feb 10 2015 02:52:31 UTC
 *
 * -Newer Old
 * 2015-08-17 20:11:55 UTC
 *
 * -Current
 * 1442431468
 */
(function(bdgg) {
    var FORMATTERS = [
        function(ts) {
            return moment.unix(ts);
        },
        function(ts) {
            return moment.utc(ts, 'YYYY-MM-DD H:mm:ss [UTC]', true);
        },
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
    }

    bdgg.stalk = (function() {
        function BDGGChatStalkMessage(message, user, timestamp) {
            ChatUserMessage.call(this, message, user, timestamp);
            this.timestampformat = 'MMM DD HH:mm:ss';
        }

        function PushChat(string) {
            destiny.chat.gui.push(new ChatInfoMessage(string));
        }

        function PushError(string) {
            destiny.chat.gui.push(new ChatErrorMessage(string));
        }

        function PushUserMessage(msg) {
            if (typeof msg === "string") {
                PushUserMessageString(msg);
            } else {
                var time = _parseTime(msg['timestamp']);
                DoPush(msg['text'], msg['nick'], time);
            }
        }

        var timeRegExp = /^\[([^\]]*)\]\s*/;
        var nickRegExp = /^<?(\w+)>?: /;
        function PushUserMessageString(msg) {
            var timeMatch = msg.match(timeRegExp);
            msg = msg.replace(timeRegExp, '');
            var nickMatch = msg.match(nickRegExp);
            msg = msg.replace(nickRegExp, '');

            if (!timeMatch || !nickMatch) {
                return;
            }

            var time = _parseTime(timeMatch[1]);
            var nick = nickMatch[1];
            DoPush(msg, nick, time);
        }

        function DoPush(msg, nick, time) {
            var user = destiny.chat.users[nick];
            if (!user) {
                user = new ChatUser({ nick: nick });
            }

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

                var listener = function(e) {
                    if (window != e.source) {
                        return;
                    }

                    if (e.data.type == 'bdgg_stalk_reply') {
                        var reply = e.data.reply;

                        if (reply.Type === "s") {
                            var strings = reply.Data;

                            for (var i = 0; i < strings.length; i++) {
                                PushUserMessage(strings[i]);
                            }
                        }
                        else if (reply.Type === "e") {
                            PushError("Error: " + reply.Error);
                        }
                    } else if (e.data.type == 'bdgg_stalk_message') {
                        PushChat(e.data.message);
                    } else if (e.data.type == 'bdgg_stalk_error') {
                        PushError(e.data.error);
                    }
                };
                window.addEventListener('message', listener);

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
                            for (i = 1; i <= nickCount; i++) {
                                Names.push(match[i]);
                            }
                            querystr["QueryType"] = "m";
                            querystr["Names"] = Names;
                            querystr["Number"] = 10;
                        }

                        if (lastIsNum) {
                            querystr["Number"] = Math.min(200, num);
                        }

                        window.postMessage({type: 'bdgg_stalk_request', query: querystr}, '*');
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
    })();
}(window.BetterDGG = window.BetterDGG || {}));
