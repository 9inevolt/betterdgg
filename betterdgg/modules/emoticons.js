;(function(bdgg) {
    bdgg.emoticons = (function() {
        var override, emoteTabPriority;

        var EMOTICONS = [ "ASLAN", "CallChad", "DJAslan", "FIDGETLOL",
            "CallCatz", "DESBRO", "Dravewin", "TooSpicy",
            "BrainSlug", "DansGame", "Kreygasm", "PJSalt", "PogChamp",
            "ResidentSleeper", "WinWaker", "ChanChamp",
            "OpieOP", "4Head", "DatSheffy", "GabeN", "SuccesS",
            "TopCake", "DSPstiny", "SephURR", "Keepo", "POTATO", "ShibeZ",
            "lirikThump", "SpookerZ", "Riperino", "NiceMeMe", "YEE", "BabyRage",
            "dayJoy", "kaceyFace", "aaaChamp", "CheekerZ"
        ];

        var NEW = [ "SourPls", "D:", "WEOW" ];

        var OVERRIDES = [ "SoSad" ];

        var SUBONLY = [ "nathanDad" ];

        var RIP = [ ].sort();

        var xmasEND = moment('2014-12-29 05:00');
        var xmasOn = moment().isBefore(xmasEND);

        var bdggSortResults = function(fnSortResults) {
            return function(a, b) {
                if (emoteTabPriority) {
                    if (a.isemote != b.isemote) {
                        return a.isemote ? -1 : 1;
                    }
                }

                return fnSortResults.apply(this, arguments);
            };
        };

        return {
            all: [],
            init: function() {
                var emoticons = EMOTICONS.concat(NEW).concat(SUBONLY)
                    .filter(function(e) { return destiny.chat.gui.emoticons.indexOf(e) == -1 })
                    .sort();
                destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons).sort();
                $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addEmote(v) });
                bdgg.emoticons.all = emoticons;

                var bdggemoteregex = new RegExp('\\b('+emoticons.join('|')+')(?:\\b|\\s|$)', 'gm');

                var BDGGEmoteFormatter = (function() {
                    function replacer(match, emote) {
                        emote = emote.replace(/[^\w-]/, '_');
                        var s = '<div title="' + emote + '" class="chat-emote';

                        if (SUBONLY.indexOf(emote) > -1) {
                            s = s + ' chat-emote-' + emote;
                        } else {
                            s = s + ' bdgg-chat-emote-' + emote;
                        }

                        if (xmasOn) {
                            s = s + ' bdgg-xmas';
                        }

                        return s + '"></div>';
                    };

                    return {
                        format: function(str, user) {
                            // use jQuery to parse str as html and only replace in text nodes
                            var wrapped = $('<span>').append(str);
                            wrapped.find('span').addBack().contents().filter(function() { return this.nodeType == 3})
                                .replaceWith(function() {
                                    return this.data
                                        .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                                        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                                        .replace(bdggemoteregex, replacer);
                                });

                            if (override) {
                                wrapped.find('.chat-emote').addClass('bdgg-chat-emote-override');
                            }

                            return wrapped.html();
                        }
                    };
                })();

                destiny.chat.gui.formatters.push(BDGGEmoteFormatter);

                // multi-emote
                $.each(destiny.chat.gui.formatters, function(i, f) {
                    if (f && f.hasOwnProperty('emoteregex') && f.hasOwnProperty('gemoteregex')) {
                        f.emoteregex = f.gemoteregex;
                        return false;
                    }
                });

                bdgg.emoticons.giveTabPriority(bdgg.settings.get('bdgg_emote_tab_priority'));
                bdgg.emoticons.overrideEmotes(bdgg.settings.get('bdgg_emote_override'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_emote_tab_priority') {
                        bdgg.emoticons.giveTabPriority(value);
                    } else if (key == 'bdgg_emote_override') {
                        bdgg.emoticons.overrideEmotes(value);
                    }
                });

                // hook into emotes command
                var fnHandleCommand = destiny.chat.handleCommand;
                destiny.chat.handleCommand = function(str) {
                    fnHandleCommand.apply(this, arguments);
                    if (/^emotes ?/.test(str)) {
                        this.gui.push(new ChatInfoMessage("Better Destiny.gg: "+ emoticons.join(", ")));

                        if (NEW.length > 0) {
                            this.gui.push(new ChatInfoMessage("NEW: "+ NEW.sort().join(", ")));
                        }

                        if (SUBONLY.length > 0) {
                            this.gui.push(new ChatInfoMessage("Unlocked: "+ SUBONLY.sort().join(", ")));
                        }

                        if (RIP.length > 0) {
                            this.gui.push(new ChatInfoMessage("RIP: "+ RIP.sort().join(", ")));
                        }

                        if (override && OVERRIDES.length > 0) {
                            this.gui.push(new ChatInfoMessage("Overrides: "+ OVERRIDES.sort().join(", ")));
                        }
                    }
                };

                var fnSortResults = destiny.chat.gui.autoCompletePlugin.sortResults;
                destiny.chat.gui.autoCompletePlugin.sortResults = bdggSortResults(fnSortResults);
            },
            giveTabPriority: function(value) {
                emoteTabPriority = value;
            },
            overrideEmotes: function(value) {
                override = value;
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
