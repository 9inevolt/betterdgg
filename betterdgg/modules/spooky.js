;(function(bdgg) {
    PROC_MAX = 0.25;
    PROC_MIN = 0.02;
    EMOTES = {
        "ASLAN": [ 'fadeIn' ],
        "DAFUK": [ 'fadeIn' ],
        "Hhhehhehe": [ 'fadeIn', 'spin' ],
        "INFESTINY": [ 'crawl' ],
        "NoTears": [ 'pulse' ],
        "SURPRISE": [ 'fadeIn', 'pulse', 'spin' ],
        "WhoahDude": [ 'blink' ],
    };
    EMOTE_RE = new RegExp("\\b(?:bdgg-)?chat-emote-(" + Object.keys(EMOTES).join('|') + ")");

    bdgg.spooky = (function() {
        var END = moment('2014-11-01 05:00');
        var on = true;
        var PROC_CHANCE = procChance();

        function isOn() {
            if (on) {
                on = moment().isBefore(END);
            }
            return on;
        }

        function procChance() {
           var daysLeft = Math.abs(END.diff(moment(), 'days')) + 1;
           return PROC_MIN + 1/daysLeft * (PROC_MAX - PROC_MIN);
        }

        function proc() {
            return Math.random() < PROC_CHANCE;
        }

        function randomEffect(emote) {
            var effects = EMOTES[emote];
            var i = Math.floor(Math.random() * effects.length);
            return effects[i];
        }

        function emoteClasses(emote) {
            if (EMOTES[emote]) {
                var effect = randomEffect(emote);
                var delay = randomDelay();
                return 'bdgg-' + effect + ' bdgg-anim-delay-' + delay;
            }

            return '';
        }

        function randomDelay() {
            return Math.floor(Math.random() * 5 + 1);
        }

        return {
            init: function() {
                var BDGGSpookyFormatter = {
                    format: function(str, user) {
                        var wrapped = $('<span>').append(str);
                        if (isOn() && proc()) {
                            var chosenEffects = {};
                            wrapped.find('.chat-emote').each(function(i, elem) {
                                var e = $(elem);
                                var classes = e.attr('class');
                                var emoteMatch = classes.match(EMOTE_RE);
                                if (emoteMatch) {
                                    var emote = emoteMatch[1];
                                    if (!chosenEffects[emote]) {
                                        chosenEffects[emote] = emoteClasses(emote);
                                    }
                                    e.addClass(chosenEffects[emote]);
                                }
                            });
                        }
                        return wrapped.html();
                    }
                };

                if (isOn()) {
                    destiny.chat.gui.formatters.push(BDGGSpookyFormatter);
                }
            },
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
