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

var BEGIN = moment('2016-10-01T13:00Z');
var END = moment('2016-11-01T13:00Z');
var on = false;
var PROC_CHANCE;

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

function refresh() {
    var m = moment();
    on = m.isAfter(BEGIN) && m.isBefore(END);
    PROC_CHANCE = procChance();
}

let spooky = {
    init: function() {
        refresh();

        var fnResolveMessage = destiny.chat.gui.resolveMessage;
        destiny.chat.gui.resolveMessage = function(data) {
            var message = fnResolveMessage.apply(this, arguments);

            if (message && message['ui'] && ownMessage(message)) {
                spooky.wrapMessage(message.ui, message, true, data.timestamp);
            }

            return message;
        }

        setInterval(refresh, 300000);
    },
    wrapMessage: function(elem, message, force, forceTime) {
        if (on && (force || !ownMessage(message))) {
            spookyFormat(elem, forceTime || message.timestamp);
        }
    },
};

export default spooky
