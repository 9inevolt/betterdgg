;(function(bdgg) {
    function push(msg, state) {
        msg && destiny.chat.gui.push(msg, state);
    };

    bdgg.test = { chat: {}, or: {} },
    bdgg.test1 = function(msg) {
        var m = destiny.chat.onMSG({data:msg || '>BetterDGG DESBRO ASLAN DJAslan LUL LUL LUL',
            nick:'BetterDGG', features:[]});
        push(m);
        setTimeout(function() { destiny.chat.onMUTE({data: 'BetterDGG'}) }, 3000);
    };

    bdgg.test2 = function() {
        destiny.chat.gui.autoCompletePlugin.addNick('GamerzKit_TV');
        destiny.chat.gui.autoCompletePlugin.promoteNick('GamerzKit_TV');
        destiny.chat.gui.autoCompletePlugin.addNick('OverRustla');
        destiny.chat.gui.autoCompletePlugin.promoteNick('OverRustla');
        var m = m=destiny.chat.onMSG({data:'Check tab completion of GameOfThrows and OverRustle',
            nick:'BetterDGG', features:[]});
        push(m);
    };

    bdgg.test3 = function() {
        var m = destiny.chat.onMSG({data:'ChanChamp http://GabeN.com/foo?s=Riperino&p=DESBRO PJSalt',
            nick:'BetterDGG', features:[]});
        push(m);
    };

    bdgg.test4 = function() {
        var m = destiny.chat.onMSG({data:'>green ChanChamp http://GabeN.com/foo?s=Riperino&p=DESBRO PJSalt',
            nick:'BetterDGG', features:['flair3']});
        push(m);
    };

    bdgg.test.chat.disconnect = function() {
        destiny.chat.dontconnect = true;
        destiny.chat.sock.close();
    };

    bdgg.test.chat.combo = function(emote, flair, nick, count) {
        emote = emote || 'DESBRO';
        features = flair ? [ flair ] : [];
        nick = nick || 'BetterDGG';
        count = count || 5;
        for (var i=0; i<count; i++) {
            var m = destiny.chat.onMSG({data:emote, nick:nick, features:features});
            push(m);
        }
    };

    bdgg.test.chat.emotes = function() {
        var emoticons = bdgg.emoticons.all;
        for (var i=0; i<emoticons.length; i++) {
            var m = destiny.chat.onMSG({data:emoticons[i], nick:'BetterDGG', features:[]});
            push(m);
        }
    };

    bdgg.test.chat.broadcast = function(str) {
        str = str || 'BetterDGG is now a Tier II subscriber! gifted by 9inevolt OverRustle';
        push(destiny.chat.onBROADCAST({data:str}));
    };

    bdgg.test.chat.info = function(str) {
        str = str || "Available commands: /emotes /me /ignore (without arguments to list the nicks ignored) /unignore /highlight (highlights target nicks messages for easier visibility) /unhighlight /maxlines /mute /unmute /subonly /ban /ipban /unban (also unbans ip bans) /timestampformat";
        push(new ChatInfoMessage(str));
    };

    bdgg.test.chat.status = function(str) {
        str = str || "Connecting to server...";
        push(new ChatStatusMessage(str));
    };

    bdgg.test.chat.error = function(str) {
        str = str || "Error contacting server";
        push(new ChatErrorMessage(str));
    };

    bdgg.test.chat.command = function(str) {
        str = str || "BetterDGG muted by Destiny";
        push(new ChatCommandMessage(str));
    };

    bdgg.test.chat.flair = function(str) {
        var msg = str || "hi there don't forget to try hiding all flair";
        push(destiny.chat.onMSG({data:msg, nick:'ILiedAboutCake', features:[]}));
        push(destiny.chat.onMSG({data:msg, nick:'mellipelli', features:[]}));
        push(destiny.chat.onMSG({data:msg, nick:'Zanshin314', features:[]}));
        push(destiny.chat.onMSG({data:msg, nick:'Mannekino', features:[]}));
    };

    bdgg.test.chat.highlight = function(str) {
        var msg = destiny.chat.user.username + " " + (str || "hi there");
        push(destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]}));
    };

    bdgg.test.chat.ignore = function(str) {
        var msg = str || " ^nsfw$ ";
        push(destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]}));
    };

    bdgg.test.chat.self = function(str, delay) {
        var msgText = str || 'Message from self WhoahDude WhoahDude WhoahDude WhoahDude WhoahDude';
        delay = delay || 1000;
        push(new ChatUserMessage(msgText, destiny.chat.user), 'pending');
        setTimeout(function() {
            destiny.chat.onMSG({data:msgText, nick:destiny.chat.user.username, features:destiny.chat.user.features,
                    timestamp:moment().valueOf()});
        }, delay);
    };

    bdgg.test.chat.inject = function(str) {
        var msg = destiny.chat.onMSG({data:(str || destiny.chat.user.username + ' <script type="text/javascript">' +
                'alert("hi there");</script><b>hi</b><br>there'),
            nick:'BetterDGG', features:['flair3']});
        push(msg);
    };

    bdgg.test.chat.mention = function(user1, user2, msg) {
        allUsers = Object.keys(destiny.chat.users);
        user1 = user1 || destiny.chat.users[allUsers[0]].username;
        user2 = user2 || destiny.chat.users[allUsers[1]].username;
        msg = msg || "hi there";
        push(destiny.chat.onMSG({data:msg + " " + user2, nick:user1, features:[]}));
        push(destiny.chat.onMSG({data:msg + " " + user1, nick:user2, features:[]}));
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
        var msg = str || "SoSad";
        push(destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]}));
    };

    bdgg.test.or.twitch = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.twitch.tv/9inevolt',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };

    bdgg.test.or.hitbox = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.hitbox.tv/9inevolt',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };

    bdgg.test.or.castamp = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://castamp.com/live/9inevolt',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };

    bdgg.test.or.ustream = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.ustream.tv/embed/6299343',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };

    bdgg.test.or.ustream2 = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.ustream.tv/channel/JoeRogan',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };

    bdgg.test.or.ustream3 = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'visit http://www.ustream.tv/z',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };

    bdgg.test.or.not = function(str) {
        var msg = destiny.chat.onMSG({data:str || 'no http before destiny.gg',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };

    bdgg.test.stalk = function(ts, expected) {
        var t = bdgg.stalk.parseTime(ts);
        if (!t.isValid()) {
            bdgg.test.chat.error("invalid timestamp");
        } else if (!t.isSame(expected)) {
            bdgg.test.chat.error("timestamp mismatch");
        } else {
            bdgg.test.chat.info("success");
        }
    };

    bdgg.test.stalk1 = function() {
        bdgg.test.stalk('01/17/2014 01:29:41', moment.unix(1389943781));
    };

    bdgg.test.stalk2 = function() {
        bdgg.test.stalk('03/07/2014 11:12:39 AM', moment.unix(1394212359));
    };

    bdgg.test.stalk3 = function() {
        bdgg.test.stalk('03/28/2014 10:33:26 AM', moment.unix(1396020806));
    };

    bdgg.test.stalk4 = function() {
        bdgg.test.stalk('Fri Sep 05 2014 01:38:01 UTC', moment.unix(1409881081));
    };

    bdgg.test.stalk5 = function() {
        bdgg.test.stalk('Sep 29 06:32:38 UTC', moment.unix(1411972358));
    };

    bdgg.test.stalk6 = function() {
        bdgg.test.stalk('Jan 19 21:00:51 UTC', moment.unix(1421701251));
    };

    bdgg.test.stalk7 = function() {
        bdgg.test.stalk('Feb 09 2015 17:46:40 UTC', moment.unix(1423504000));
    };

    bdgg.test.stalk8 = function() {
        bdgg.test.stalk('2015-08-17 20:11:55 UTC', moment.unix(1439842315));
    };

    bdgg.test.subreddit = function(str) {
        var msg = destiny.chat.onMSG({data:str || '/r/destiny! also /r/fallout_shelter, /r/starcraft? maybe /r/games',
            nick:'BetterDGG', features:['flair1']});
        push(msg);
    };
}(window.BetterDGG = window.BetterDGG || {}));
