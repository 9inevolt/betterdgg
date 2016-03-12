;(function(bdgg) {

    var muted = false;
    var muteMessage = "";
    var lastMute = 0;

    function _timeDiff( tstart, tend ) {
        var diff = Math.floor((tend - tstart) / 1000), units = [
            { d: 60, l: "seconds" },
            { d: 60, l: "minutes" }
        ];

        var s = '';
        for (var i = 0; i < units.length; ++i) {
            s = (diff % units[i].d) + " " + units[i].l + " " + s;
            diff = Math.floor(diff / units[i].d);
        }
        return s;
    };

    bdgg.chat = (function() {
        return {
            init: function() {
                var fnChatMUTE = destiny.chat.onMUTE;

        var bdggChatMUTE = function(data) {
            var bdggMUTE = fnChatMUTE.apply(this, arguments);
            if (data.data.toLowerCase() == this.user.username.toLowerCase()){
                muted = true;
            }
            //console.log(data);
            return bdggMUTE;
        };

        destiny.chat.onMUTE = bdggChatMUTE;

        var fnChatMSG = destiny.chat.onMSG;

        var bdggChatMSG = function(data) {
            var bdggMessage = fnChatMSG.apply(this, arguments);

            if (bdgg.settings.get('bdgg_disable_combos') == true){
                //I copied this from Dicedlemming it might suck but it works.
                ChatEmoteMessage=function(emote,timestamp){return this.emotecount=-999,this.emotecountui=null,this}
            }

            if (data.nick == "Bot" && muted){
                console.log("Mute Message found");
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
            if (data == "muted"){
                //console.log(data);
                //console.log(muteMessage);
                var n = muteMessage.match(/[0-9]*[0-9]m/);  //find mute timestamp
                if (n != null){
                    var nString = n.toString();
                    var muteLength = nString.substr(0, nString.length-1);
                    muteLength = parseInt(muteLength);
                    muteLength = lastMute+muteLength*60*1000; //Add seconds to timestamp
                    var newDate = new Date();
                    var currentStamp = newDate.getTime();
                    this.gui.push(new ChatInfoMessage("You are still muted for: "+_timeDiff(currentStamp, muteLength)));
                }    

                else{
                    this.gui.push(new ChatInfoMessage("No mute timestamp recorded."));
                }    
            }
            return bdggERR;
        };

        destiny.chat.onERR = bdggChatERR;
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
