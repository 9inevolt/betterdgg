;(function(bdgg) {
    bdgg.emoticons = (function() {
        return {
            EMOTICONS: [ "ASLAN", "CallChad", "DJAslan", "FIDGETLOL",
                "CallCatz", "DESBRO", "Dravewin", "TooSpicy",
                "BrainSlug", "DansGame", "Kreygasm", "PJSalt", "PogChamp",
                "ResidentSleeper", "WinWaker", "ChanChamp", "RipPA",
                "OpieOP", "4Head", "DatSheffy", "GabeN", "SuccesS", "DankMeMe"
            ],
            init: function() {
                var emoticons = bdgg.emoticons.EMOTICONS
                    .filter(function(e) { return destiny.chat.gui.emoticons.indexOf(e) == -1 })
                    .sort();
                destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons).sort();
                $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addData(v, 2) });

                var bdggemoteregex = new RegExp('\\b('+emoticons.join('|')+')\\b', 'gm');
                var BDGGEmoteFormatter = {
                    format: function(str, user) {
                        // use jQuery to parse str as html and only replace in text nodes
                        var wrapped = $('<span>').append(str);
                        wrapped.find('span').addBack().contents().filter(function() { return this.nodeType == 3})
                            .replaceWith(function() {
                                return $(this).text().replace(bdggemoteregex, '<div title="$1" class="chat-emote bdgg-chat-emote-$1"></div>');
                            });
                        return wrapped.html();
                    }
                };

                destiny.chat.gui.formatters.push(BDGGEmoteFormatter);

                // multi-emote
                $.each(destiny.chat.gui.formatters, function(i, f) {
                    if (f && f.hasOwnProperty('emoteregex') && f.hasOwnProperty('gemoteregex')) {
                        f.emoteregex = f.gemoteregex;
                        return false;
                    }
                });

                bdgg.emoticons.giveTabPriority(bdgg.settings.get('bdgg_emote_tab_priority'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_emote_tab_priority') {
                        bdgg.emoticons.giveTabPriority(value);
                    }
                });

                // hook into emotes command
                var fnHandleCommand = destiny.chat.handleCommand;
                destiny.chat.handleCommand = function(str) {
                    fnHandleCommand.apply(this, arguments);
                    if (/^emotes ?/.test(str)) {
                        this.gui.push(new ChatInfoMessage("Better Destiny.gg: "+ emoticons.join(", ")));
                    }
                };
            },
            giveTabPriority: function(value) {
                var weight = value ? Number.MAX_VALUE : 2;
                for (var i = 0; i < destiny.chat.gui.emoticons.length; i++) {
                    var emote = destiny.chat.gui.emoticons[i];
                    destiny.chat.gui.autoCompletePlugin.addData(emote, weight);
                }
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
