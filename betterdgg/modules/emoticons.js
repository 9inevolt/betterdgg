import settings from './settings';

var override, emoteTabPriority, everyEmote, baseEmotes;

var EMOTICONS = [ "CallChad", "FIDGETLOL", "ASLAN",
    "CallCatz", "Dravewin", "YEE", "PEPE", "DJAslan"
];

var BBDGG_EMOTICONS = ["DESBRO", "ChanChamp", "SuccesS", "TopCake", "DSPstiny", "SephURR",
    "POTATO", "Riperino", "NiceMeMe", "dayJoy", "kaceyFace",
    "AlisherZ", "WEOW", "Depresstiny", "HerbPerve", "CARBUCKS", "Jewstiny",
    "ITSRAWWW", "CallHafu", "ChibiDesti", "CORAL", "CUX", "NOBULLY", "CheekerZ"
];

var TWITCH_EMOTICONS = ["BrainSlug", "DansGame", "Kreygasm", "PJSalt", "PogChamp",
    "ResidentSleeper", "WinWaker", "OpieOP", "4Head", "DatSheffy", "TooSpicy", "Keepo",
    "lirikThump", "BabyRage", "EleGiggle", "SwiftRage", "SMOrc", "SSSsss", "KappaPride",
    "MingLee", "OhMyDog", "CoolCat", "gachiGASM", "NotLikeThis"
];

var BTTV_EMOTICONS = ["GabeN", "ShibeZ", "D:", "FeelsBadMan", "FeelsGoodMan", "haHAA", "FeelsAmazingMan"];

var NEW = [ ];

var ANIMATED = [ "CuckCrab", "SourPls", "RaveDoge", "BAR" ];

var OVERRIDES = [ "SoSad", "SpookerZ", "Kappa", "OhKrappa", "DappaKappa", "Klappa" ];

var TEXT = [ "OuO", "XD", "xD" ];

var SUBONLY = [ "nathanD", "nathanF", "nathanNotears", "nathanPepe",
"nathanTowel", "nathanRustle", "nathanWat", "nathanYee" ];

var RIP = [ ].sort();

var xmasEND, xmasOn;

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

    // Disable Animated Emotes
    if (ANIMATED.indexOf(emote) > -1 && settings.get('bdgg_animate_disable')) {
        return emote;
    }

    // Inject class
    if (SUBONLY.indexOf(emote) > -1) {
        s = s + ' chat-emote-' + emote;
    }
    else if (TEXT.indexOf(emote) > -1) {
        s = emote + s + ' bdgg-chat-emote-' + emote;
    }
    else {
        s = s + ' bdgg-chat-emote-' + emote;
    }

    if (xmasOn) {
        s = s + ' bdgg-xmas';
    }

    return s + '">' + emote + ' </div>';
};

let bdgg_emoticons = {
    all: [],
    init: function() {
        xmasEND = moment('2014-12-29 05:00');
        xmasOn = moment().isBefore(xmasEND);

        baseEmotes = destiny.chat.gui.emoticons;
        emoticons = EMOTICONS.concat(NEW).concat(SUBONLY).concat(TEXT).concat(ANIMATED)
            .concat(BBDGG_EMOTICONS).concat(TWITCH_EMOTICONS).concat(BTTV_EMOTICONS)
            .filter(function(e) { return baseEmotes.indexOf(e) === -1; })
            .sort();
        destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons).sort();
        $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addEmote(v) });
        this.all = emoticons;
        everyEmote = destiny.chat.gui.emoticons;

        this.textEmoteDisable(settings.get('bdgg_text_disable'));

        bdggemoteregex = new RegExp('\\b('+emoticons.join('|')+')(?:\\b|\\s|$)', 'gm');

        // multi-emote
        $.each(destiny.chat.gui.formatters, function(i, f) {
            if (f && f.hasOwnProperty('emoteregex') && f.hasOwnProperty('gemoteregex')) {
                f.emoteregex = f.gemoteregex;
                return false;
            }
        });

        this.giveTabPriority(settings.get('bdgg_emote_tab_priority'));
        this.overrideEmotes(settings.get('bdgg_emote_override'));
        settings.addObserver((key, value) => {
            if (key == 'bdgg_emote_tab_priority') {
                this.giveTabPriority(value);
            } else if (key == 'bdgg_emote_override') {
                this.overrideEmotes(value);
            } else if (key == 'bdgg_text_disable') {
                this.textEmoteDisable(value);
            }
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

        $(() => { this.organizeEmotes(); });
    },
    giveTabPriority: function(value) {
        emoteTabPriority = value;
    },
    overrideEmotes: function(value) {
        override = value;
    },
    textEmoteDisable: function(value) {
        if (value) {
            destiny.chat.gui.emoticons = baseEmotes.concat(this.all).filter((e) => {
                return TEXT.indexOf(e) === -1;
            }).sort();
        } else {
            destiny.chat.gui.emoticons = everyEmote;
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
    },
    organizeEmotes: function() {
        // Show the emote menu
        $('#emoticon-btn').click();

        var $emotesBox = $('#destiny-emotes');

        // Delete the spacing because I personally think it's ugly
        $emotesBox.parent().find('hr').remove();

        //TODO: use templates for this
        $emotesBox.prepend('<div id="TwitchEmoteContainer"><h6>Twitch Emotes (Non Sub)</h6></div>');
        $emotesBox.prepend('<div id="BTTVEmoteContainer"><h6>BTTV Emotes</h6></div>');
        $emotesBox.prepend('<div id="BBDGGEmoteContainer"><h6>BBDGG Emotes</h6></div>');
        $emotesBox.prepend('<div id="DGGEmoteContainer"><h6>DGG Emotes</h6></div>');

        $emotesBox.find('.chat-emote').each(function(id, elem) {
            var $emoteName = $(elem).attr('title');
            var $emoteClone = $(elem).parent().remove();

            // Filter emotes into their respective containers
            if ($.inArray($emoteName, baseEmotes) > -1) {
                $('#DGGEmoteContainer').append($emoteClone);
            } else {
                $(elem).addClass('bdgg-chat-emote-' + $emoteName);
                if (override) {
                    $(elem).addClass('bdgg-chat-emote-override' + $emoteName);
                }

                if ($.inArray($emoteName, TWITCH_EMOTICONS) > -1) {
                    $('#TwitchEmoteContainer').append($emoteClone);
                }
                else if ($.inArray($emoteName, BTTV_EMOTICONS) > -1) {
                    $('#BTTVEmoteContainer').append($emoteClone);
                }
                else if ($.inArray($emoteName, BBDGG_EMOTICONS) > -1) {
                    $('#BBDGGEmoteContainer').append($emoteClone);
                }
                else if ($.inArray($emoteName, ANIMATED) > -1) {
                    $('#BBDGGEmoteContainer').append($emoteClone);
                }
            }
        });

        // Hide emote menu
        $('#emoticon-btn').click();
    }
}

export default bdgg_emoticons
