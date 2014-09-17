;(function(bdgg) {
    bdgg.emoticons = (function() {
        return {
            init: function() {
                var EMOTICONS = [ "ASLAN", "CallChad", "DJAslan", "FIDGETLOL",
                    "CallCatz", "DESBRO", "Dravewin", "TooSpicy"
                ];
                var emoticons = EMOTICONS.filter(function(e) { return destiny.chat.gui.emoticons.indexOf(e) == -1 });
                destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons);
                $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addData(v, 2) });

                var BDGGEmoteFormatter = {
                    bdggemoteregex: new RegExp('\\b('+emoticons.join('|')+')\\b', 'gm'),

                    format: function(str, user) {
                        return str.replace(this.bdggemoteregex, '<div title="$1" class="chat-emote bdgg-chat-emote-$1"></div>');
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
