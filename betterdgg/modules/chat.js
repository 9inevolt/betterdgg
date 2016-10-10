import settings from './settings';

var muted = false;
var muteMessage = "";
var lastMute = 0;

// save original ChatEmoteMessage now so that we can revert back to it later
var OriginalChatEmoteMessage = ChatEmoteMessage;

function _timeDiff(tstart, tend) {
    var diff = Math.floor((tend - tstart) / 1000);
    var units = [
        { d: 60, l: "seconds" },
        { d: 60, l: "minutes" }
    ];

    var s = '';
    for (var i = 0; i < units.length; ++i) {
        s = (diff % units[i].d) + " " + units[i].l + " " + s;
        diff = Math.floor(diff / units[i].d);
    }
    return s;
}

let _disableCombos = false;

let chat = {
    init: function() {
        this.disableCombos(settings.get('bdgg_disable_combos'));
        settings.addObserver((key, value) => {
            if (key === 'bdgg_disable_combos') {
                this.disableCombos(value);
            }
        });

        var fnChatMUTE = destiny.chat.onMUTE;

        var bdggChatMUTE = function(data) {
            var bdggMUTE = fnChatMUTE.apply(this, arguments);
            if (data.data.toLowerCase() === this.user.username.toLowerCase()) {
                muted = true;
            }
            return bdggMUTE;
        };

        destiny.chat.onMUTE = bdggChatMUTE;

        var fnChatMSG = destiny.chat.onMSG;

        var bdggChatMSG = function(data) {
            var bdggMessage = fnChatMSG.apply(this, arguments);

            if (_disableCombos) {
                //TODO
                //I copied this from Dicedlemming it might suck but it works.
                ChatEmoteMessage = function() {
                    return this.emotecount = -999, this.emotecountui = null, this;
                };
            } else {
                ChatEmoteMessage = OriginalChatEmoteMessage;
            }

            //TODO: should match nick
            if (data.nick === "Bot" && muted) {
                lastMute = data.timestamp;
                muteMessage = data.data;
                muted = false;
            }

            return bdggMessage;
        };

        destiny.chat.onMSG = bdggChatMSG;

        var fnChatERR = destiny.chat.onERR;

        var bdggChatERR = function(data) {
            var bdggERR = fnChatERR.apply(this, arguments);
            if (data === "muted") {
                // Find mute timestamp
                var n = muteMessage.match(/[0-9]*[0-9]m/);
                if (n !== null) {
                    var nString = n.toString();
                    var muteLength = nString.substr(0, nString.length - 1);
                    muteLength = parseInt(muteLength);

                    // Add seconds to timestamp
                    muteLength = lastMute + muteLength * 60 * 1000;
                    var newDate = new Date();
                    var currentStamp = newDate.getTime();
                    this.gui.push(new ChatInfoMessage("You are still muted for: " + _timeDiff(currentStamp, muteLength)));
                }
                else {
                    this.gui.push(new ChatInfoMessage("No mute timestamp recorded."));
                }
            }
            return bdggERR;
        };

        destiny.chat.onERR = bdggChatERR;
    },
    disableCombos: function(value) {
        _disableCombos = value;
    }
};

export default chat
