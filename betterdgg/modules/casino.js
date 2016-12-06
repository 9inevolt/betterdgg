var EMOTES = {
    "BAR": {
        numReels: 3,
        numStops: 48,
        stops: {
            "Banana":     [ 18, 13, 12 ],
            "Watermelon": [ 14, 10, 8 ],
            "Cherry":     [ 10, 14, 16 ],
            "Seven":      [ 1, 5, 8 ],
            "TripleBar":  [ 4, 3, 1 ],
            "BigWin":     [ 1, 3, 3 ]
        }
    }
};

var EMOTE_RE = new RegExp("\\b(?:bdgg-)?chat-emote-(" + Object.keys(EMOTES).join('|') + ")");

var _reel = 0;
const _incDelay = 250, _initDelay = 1000;

const A = 1103515245, C = 12345;
const MBITS = 31, MASK = (1 << MBITS) - 1; //M = 2^31

function Random(seed) {
    this._seed = (seed ^ A) & MASK;
}

Random.prototype._next = function(bits) {
    //this._seed = (this._seed * A + C) % M;
    this._seed = (this._seed * A + C) & MASK;
    return this._seed >>> (MBITS - bits);
};

Random.prototype.next = function() {
    return this._next(16);
};

Random.prototype.nextFloat = function() {
    return this._next(24) / (1 << 24);
};

function randomEffect(emote, num) {
    var reel = _reel % emote.numReels;
    var stop = Math.floor(num * emote.numStops);

    var keys = Object.keys(emote.stops).sort();
    var total = 0;
    for (var i=0; i<keys.length; i++) {
        total += emote.stops[keys[i]][reel];
        if (stop < total) {
            //console.debug("Reel: " + reel + ", Stop: " + keys[i]);
            return keys[i];
        }
    }
}

function emoteClasses(emote, rand) {
    if (EMOTES[emote]) {
        return randomEffect(EMOTES[emote], rand.nextFloat());
    }

    return '';
}

function casinoFormat(wrapped, timestamp) {
    var rand = new Random(timestamp);
    _reel = 0;

    wrapped.find('.chat-emote').each(function(i, elem) {
        var e = $(elem);
        var classes = e.attr('class');
        var emoteMatch = classes.match(EMOTE_RE);

        if (emoteMatch) {
            var emote = emoteMatch[1];
            var classes = emoteClasses(emote, rand);
            var eid = rand._seed + "-" + i;
            elem.id = eid;

            setTimeout(function() {
                $(document.getElementById(eid)).addClass(classes);
            }, _initDelay + _incDelay * _reel);

            _reel++;
        }
    });
}

function ownMessage(message) {
    return message && message['user'] && destiny.chat['user']
            && destiny.chat.user['username'] == message.user['username'];
}

let casino = {
    init: function() {
        var fnResolveMessage = destiny.chat.gui.resolveMessage;
        destiny.chat.gui.resolveMessage = function(data) {
            var message = fnResolveMessage.apply(this, arguments);

            if (message && message['ui'] && ownMessage(message)) {
                casino.wrapMessage(message.ui, message, true, data.timestamp);
            }

            return message;
        };
    },
    wrapMessage: function(elem, message, force, forceTime) {
        if (force || !ownMessage(message)) {
            casinoFormat(elem, forceTime || message.timestamp);
        }
    },
};

export default casino;
