;(function(bdgg) {
    bdgg.test = { chat: {} },
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

    bdgg.test.chat.theme = function() {
        $('.chat').toggleClass('chat-theme-dark').toggleClass('chat-theme-light');
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

    bdgg.test.chat.inject = function(str) {
        var msg = destiny.chat.onMSG({data:(str || destiny.chat.user.username + ' <script type="text/javascript">' +
                'alert("hi there");</script><b>hi</b><br>there'),
            nick:'BetterDGG', features:['flair3']});
        destiny.chat.gui.push(msg);
    };
}(window.BetterDGG = window.BetterDGG || {}));
