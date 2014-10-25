;(function(bdgg) {
    bdgg.test = { chat: {}, or: {} },
    bdgg.test1 = function() {
        var m = destiny.chat.onMSG({data:'>BetterDGG DESBRO ASLAN DJAslan LUL LUL LUL',
            nick:'BetterDGG', features:[]});
        destiny.chat.gui.push(m);
        setTimeout(function() { destiny.chat.onMUTE({data: 'BetterDGG'}) }, 3000);
    };

    bdgg.test2 = function() {
        destiny.chat.gui.autoCompletePlugin.addData('GamerzKit_TV', Date.now());
        destiny.chat.gui.autoCompletePlugin.addData('OverRustla', Date.now());
        var m = m=destiny.chat.onMSG({data:'Check tab completion of GameOfThrows and OverRustle',
            nick:'BetterDGG', features:[]});
        destiny.chat.gui.push(m);
    };

    bdgg.test3 = function() {
        var m = destiny.chat.onMSG({data:'ChanChamp http://GabeN.com/foo?s=RipPA&p=DESBRO PJSalt',
            nick:'BetterDGG', features:[]});
        destiny.chat.gui.push(m);
    };

    bdgg.test4 = function() {
        var m = destiny.chat.onMSG({data:'>green ChanChamp http://GabeN.com/foo?s=RipPA&p=DESBRO PJSalt',
            nick:'BetterDGG', features:['flair3']});
        destiny.chat.gui.push(m);
    };

    bdgg.test.chat.combo = function(emote, count) {
        emote = emote || 'DESBRO';
        count = count || 5;
        for (var i=0; i<count; i++) {
            var m = destiny.chat.onMSG({data:emote, nick:'BetterDGG', features:[]});
            m && destiny.chat.gui.push(m);
        }
    };

    bdgg.test.chat.emotes = function() {
        var emoticons = bdgg.emoticons.EMOTICONS;
        for (var i=0; i<emoticons.length; i++) {
            var m = destiny.chat.onMSG({data:emoticons[i], nick:'BetterDGG', features:[]});
            m && destiny.chat.gui.push(m);
        }
    };

    bdgg.test.chat.broadcast = function(str) {
        str = str || 'BetterDGG is now a Tier II subscriber! gifted by 9inevolt OverRustle';
        destiny.chat.gui.push(destiny.chat.onBROADCAST({data:str}));
    };

    bdgg.test.chat.info = function(str) {
        str = str || "Available commands: /emotes /me /ignore (without arguments to list the nicks ignored) /unignore /highlight (highlights target nicks messages for easier visibility) /unhighlight /maxlines /mute /unmute /subonly /ban /ipban /unban (also unbans ip bans) /timestampformat";
        destiny.chat.gui.push(new ChatInfoMessage(str));
    };

    bdgg.test.chat.status = function(str) {
        str = str || "Connecting to server...";
        destiny.chat.gui.push(new ChatStatusMessage(str));
    };

    bdgg.test.chat.error = function(str) {
        str = str || "Error contacting server";
        destiny.chat.gui.push(new ChatErrorMessage(str));
    };

    bdgg.test.chat.command = function(str) {
        str = str || "BetterDGG muted by Destiny";
        destiny.chat.gui.push(new ChatCommandMessage(str));
    };

    bdgg.test.chat.highlight = function(str) {
        var msg = destiny.chat.user.username + " " + (str || "hi there");
        destiny.chat.gui.push(destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]}));
    };

    bdgg.test.chat.self = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'Message from self WhoahDude',
            nick:destiny.chat.user.username, features:destiny.chat.user.features});
        destiny.chat.gui.push(msg);
    };

    bdgg.test.chat.inject = function(str) {
        var msg = destiny.chat.onMSG({data:(str || destiny.chat.user.username + ' <script type="text/javascript">' +
                'alert("hi there");</script><b>hi</b><br>there'),
            nick:'BetterDGG', features:['flair3']});
        destiny.chat.gui.push(msg);
    };

    // fake injected content in message
    bdgg.test.chat.security = function(str) {
        var msg = destiny.chat.onMSG({data:'', nick:'BetterDGG', features:['flair2']});
        var html = str || 'foo <b>abc</b> <script>alert("hi");</script> <div onload="javascript:alert(\"onload\");"></div> ...';
        var f = destiny.chat.gui.formatters;
        try {
            destiny.chat.gui.formatters = [{ format: function() {
                return html;
            }}];
            destiny.chat.gui.put(msg);
            destiny.chat.gui.scrollPlugin.updateAndScroll(true);
        } finally {
           destiny.chat.gui.formatters = f;
        }
    };

    bdgg.test.chat.override = function(str) {
        var msg = str || "KINGSLY";
        destiny.chat.gui.push(destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]}));
    };

    bdgg.test.or.twitch = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.twitch.tv/9inevolt',
            nick:'BetterDGG', features:['flair1']});
        destiny.chat.gui.push(msg);
    };

    bdgg.test.or.hitbox = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.hitbox.tv/9inevolt',
            nick:'BetterDGG', features:['flair1']});
        destiny.chat.gui.push(msg);
    };

    bdgg.test.or.castamp = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://castamp.com/live/9inevolt',
            nick:'BetterDGG', features:['flair1']});
        destiny.chat.gui.push(msg);
    };

    bdgg.test.or.ustream = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.ustream.tv/embed/6299343',
            nick:'BetterDGG', features:['flair1']});
        destiny.chat.gui.push(msg);
    };

    bdgg.test.or.not = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'no http before destiny.gg',
            nick:'BetterDGG', features:['flair1']});
        destiny.chat.gui.push(msg);
    };
}(window.BetterDGG = window.BetterDGG || {}));
