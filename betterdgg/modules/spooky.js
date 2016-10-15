(function(bdgg) {
    var PROC_MAX = 0.25;
    var PROC_MIN = 0.02;
    var EMOTES = {
        "ASLAN": [ 'fadeIn' ],
        "DAFUK": [ 'fadeIn' ],
        "Hhhehhehe": [ 'fadeIn', 'spin' ],
        "INFESTINY": [ 'crawl' ],
        "NoTears": [ 'pulse' ],
        "SURPRISE": [ 'fadeIn', 'pulse', 'spin' ],
        "WhoahDude": [ 'blink' ],
        "YEE": [ 'crawl' ],
        "NOBULLY": [ 'spooker' ],
        "Riperino": [ 'spooker' ]
    };
    var EMOTE_RE = new RegExp("\\b(?:bdgg-)?chat-emote-(" + Object.keys(EMOTES).join('|') + ")");

    bdgg.spooky = (function() {
        var END = moment.utc('2016-11-01 05:00');
        var on = true;

        function isOn() {
            if (on) {
                on = moment.utc().isBefore(END);
            }
            return on;
        }

        function procChance() {
            var daysLeft = Math.abs(END.diff(moment.utc(), 'days')) + 1;
            return PROC_MIN + 1/daysLeft * (PROC_MAX - PROC_MIN);
        }

        // https://stackoverflow.com/questions/521295/javascript-random-seeds
        // Far from ideal RNG, but for emotes it should suffice
        var seed = 1;
        function rng() {
            var x = Math.sin(seed--) * 10000;
            return x - Math.floor(x);
        }

        function proc() {
            var p = rng() < procChance();
            return p;
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
                    format: function(str) {
                        var wrapped = $('<span>').append(str);

                        if (isOn() && !bdgg.settings.get('bdgg_spooker_switch')) {
                            var chosenEffects = {};
                            wrapped.find('.chat-emote').each(function(i, elem) {
                                if (proc()){ //proc per emote
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
                                }
                            });
                        }
                        // Very non-ideal solution for global syncing.
                        // Take the timestamp of the last message in chat (the one before you post) and seed the rng with that.
                        // Because of how chat handles your own messages (adds them instantly instead of taking the one from the server),
                        // any message that comes directly after the one you posted yourself will be out of sync.
                        seed = destiny.chat.gui.userMessages[destiny.chat.gui.userMessages.length-1].timestamp._i;
                        return wrapped.html();
                    }
                };

                if (isOn()) {
                    destiny.chat.gui.formatters.push(BDGGSpookyFormatter);
                }
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
