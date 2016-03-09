;(function(bdgg) {
    bdgg.emoticons = (function() {
        var override, emoteTabPriority, everyEmote;
        var baseEmotes = destiny.chat.gui.emoticons;

        var EMOTICONS = [ "CallChad", "FIDGETLOL",
            "CallCatz", "DESBRO", "Dravewin", "TooSpicy",
            "BrainSlug", "DansGame", "Kreygasm", "PJSalt", "PogChamp",
            "ResidentSleeper", "WinWaker", "ChanChamp",
            "OpieOP", "4Head", "DatSheffy", "GabeN", "SuccesS",
            "TopCake", "DSPstiny", "SephURR", "Keepo", "POTATO", "ShibeZ",
            "lirikThump", "Riperino", "NiceMeMe", "YEE", "BabyRage",
            "dayJoy", "kaceyFace", "AlisherZ", "D:",
            "WEOW", "Depresstiny", "HerbPerve", "CARBUCKS", "Jewstiny", "PEPE",
            "ITSRAWWW", "EleGiggle", "SwiftRage", "SMOrc", "SSSsss", "CallHafu",
            "ChibiDesti", "CORAL", "CUX", "KappaPride", "DJAslan",
            "MingLee", "OhMyDog", "CoolCat", "FeelsBadMan", "FeelsGoodMan",
            "NOBULLY", "haHAA", "gachiGASM"

        ];

        var NEW = [ ];

        var ANIMATED = [ "CuckCrab", "SourPls", "RaveDoge" ];

        var OVERRIDES = [ "SoSad", "SpookerZ", "Kappa", "OhKrappa", "DappaKappa", "Klappa" ];

        var TEXT = [ "OuO", "XD", "xD" ];

        var SUBONLY = [ "nathanDad", "nathanFeels", "nathanFather", "nathanDank",
        "nathanDubs1", "nathanDubs2", "nathanDubs3", "nathanParty" ];

        var RIP = [ ].sort();

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

        var emoticons, bdggemoteregex;
        function replacer(match, emote) {
            var s = '<div title="' + emote + '" class="chat-emote';
            emote = emote.replace(/[^\w-]/, '_');

            //Disable Animated Emotes
            if (ANIMATED.indexOf(emote) > -1 && bdgg.settings.get('bdgg_animate_disable') == true) {
                return emote;
            }

            //Injecct class
            if (SUBONLY.indexOf(emote) > -1) {
                s = s + ' chat-emote-' + emote;
            } 

            else if (TEXT.indexOf(emote) > -1){
                s = emote + s + ' bdgg-chat-emote-' + emote;
            }

            else {
                s = s + ' bdgg-chat-emote-' + emote;
            }

            return s + '"></div>';

        };

        return {
            all: [],
            init: function() {
                emoticons = EMOTICONS.concat(NEW).concat(SUBONLY).concat(TEXT).concat(ANIMATED)
                    .filter(function(e) { return destiny.chat.gui.emoticons.indexOf(e) == -1 })
                    .sort();
                destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons).sort();
                $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addEmote(v) });
                bdgg.emoticons.all = emoticons;
                everyEmote = destiny.chat.gui.emoticons;

                bdgg.emoticons.textEmoteDisable(bdgg.settings.get('bdgg_text_disable'));

                bdggemoteregex = new RegExp('\\b('+emoticons.join('|')+')(?:\\b|\\s|$)', 'gm');

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
                    } else if (key == 'bdgg_text_disable') {
                        bdgg.emoticons.textEmoteDisable(value);}
                });

                // hook into emotes command
                var fnHandleCommand = destiny.chat.handleCommand;
                destiny.chat.handleCommand = function(str) {
                    fnHandleCommand.apply(this, arguments);
                    if (/^emotes ?/.test(str)) {
                        this.gui.push(new ChatInfoMessage("Better Destiny.gg: "+ emoticons.join(", ")));

                        if (SUBONLY.length > 0) {
                            this.gui.push(new ChatInfoMessage("Unlocked: "+ SUBONLY.sort().join(", ")));
                        }

                        if (RIP.length > 0) {
                            this.gui.push(new ChatInfoMessage("RIP: "+ RIP.sort().join(", ")));
                        }

                        if (override && OVERRIDES.length > 0) {
                            this.gui.push(new ChatInfoMessage("Overrides: "+ OVERRIDES.sort().join(", ")));
                        }

                        if (NEW.length > 0) {
                            this.gui.push(new ChatInfoMessage("NEW: "+ NEW.sort().join(", ")));
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
            },
            textEmoteDisable: function(value) {
                
                var editEmoteList;

                if (value == true){

                    editEmoteList = EMOTICONS.concat(NEW).concat(SUBONLY).concat(ANIMATED)
                    .filter(function(e) { return baseEmotes.indexOf(e) == -1 })
                    .sort();

                    destiny.chat.gui.emoticons = baseEmotes.concat(editEmoteList).sort();
                    bdgg.emoticons.all = editEmoteList;

                }

                else {

                    editEmoteList = EMOTICONS.concat(NEW).concat(SUBONLY).concat(ANIMATED).concat(TEXT)
                    .filter(function(e) { return baseEmotes.indexOf(e) == -1 })
                    .sort();

                    destiny.chat.gui.emoticons = everyEmote;
                    bdgg.emoticons.all = editEmoteList;

                }


            },
            wrapMessage: function(wrapped, message) {
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
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
