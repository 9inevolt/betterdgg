;(function(bdgg) {
    bdgg.spooky = (function() {
        var PROC_MAX = 0.4;
        var PROC_MIN = 0.02;
        var EMOTES = {
            "ASLAN": [ 'fadeIn' ],
            "BabyRage": [ 'spin' ],
            "D_": [ 'blink' ],
            "DAFUK": [ 'fadeIn', 'blink' ],
            "Hhhehhehe": [ 'fadeIn', 'spin' ],
            "INFESTINY": [ 'crawl' ],
            "NoTears": [ 'pulse' ],
            "PEPE": [ 'pulse' ],
            "Riperino": [ 'fadeIn' ],
            "SSSsss": [ 'pulse' ],
            "SURPRISE": [ 'fadeIn', 'pulse', 'spin' ],
            "WhoahDude": [ 'blink' ],
            "YEE": [ 'pulse' ],
        };
        var EMOTE_RE = new RegExp("\\b(?:bdgg-)?chat-emote-(" + Object.keys(EMOTES).join('|') + ")");

        var BEGIN = moment('2015-10-01 05:00');
        var END = moment('2015-11-01 05:00');
        var on = false;
        var PROC_CHANCE = procChance();

        function Random(seed) {
            this._seed = seed % 2147483647;
            if (this._seed <= 0) this._seed += 2147483646;
        }

        Random.prototype.next = function() {
            return this._seed = this._seed * 16807 % 2147483647;
        };

        Random.prototype.nextFloat = function() {
            // We know that result of next() will be 1 to 2147483646 (inclusive).
            return (this.next() - 1) / 2147483646;
        };

        function procChance() {
           var daysLeft = Math.abs(END.diff(moment(), 'days')) + 1;
           return PROC_MIN + 1/daysLeft * (PROC_MAX - PROC_MIN);
        }

        function proc(num) {
            return num < PROC_CHANCE;
        }

        function randomEffect(emote, num) {
            var effects = EMOTES[emote];
            var i = Math.floor(num * effects.length);
            return effects[i];
        }

        function emoteClasses(emote, rand) {
            if (EMOTES[emote]) {
                var effect = randomEffect(emote, rand.nextFloat());
                var delay = randomDelay(rand.nextFloat());
                return 'bdgg-' + effect + ' bdgg-anim-delay-' + delay;
            }

            return '';
        }

        function randomDelay(num) {
            return Math.floor(num * 5 + 1);
        }

        function spookyFormat(wrapped, timestamp) {
            var rand = new Random(timestamp);
            wrapped.find('.chat-emote').each(function(i, elem) {
                var e = $(elem);
                var classes = e.attr('class');
                var emoteMatch = classes.match(EMOTE_RE);

                if (emoteMatch && proc(rand.nextFloat())) {
                    var emote = emoteMatch[1];
                    e.addClass(emoteClasses(emote, rand));
                }
            });
        }

        function ownMessage(message) {
            return message && message['user'] && destiny.chat['user']
                    && destiny.chat.user['username'] == message.user['username'];
        }

        return {
            init: function() {
                var m = moment();
                on = m.isAfter(BEGIN) && m.isBefore(END);

                var fnResolveMessage = destiny.chat.gui.resolveMessage;
                destiny.chat.gui.resolveMessage = function(data) {
                    var message = fnResolveMessage.apply(this, arguments);

                    if (message && message['ui'] && ownMessage(message)) {
                        bdgg.spooky.wrapMessage(message.ui, message, true, data.timestamp);
                    }

                    return message;
                }
            },
            wrapMessage: function(elem, message, force, forceTime) {
                if (on && (force || !ownMessage(message))) {
                    spookyFormat(elem, forceTime || message.timestamp);
                }
            },
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
