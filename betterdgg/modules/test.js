import emoticons from './emoticons';
import * as templates from './templates';

function push(msg, state) {
    msg && destiny.chat.gui.push(msg, state);
};

function bdgg_push(msg) {
    destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]});
};

let test1 = function(msg) {
    destiny.chat.onMSG({data:msg || '>BetterDGG DESBRO ASLAN DJAslan LUL LUL LUL',
        nick:'BetterDGG', features:[]});
    setTimeout(function() { destiny.chat.onMUTE({data: 'BetterDGG'}) }, 3000);
};

let test2 = function() {
    destiny.chat.gui.autoCompletePlugin.addNick('GamerzKit_TV');
    destiny.chat.gui.autoCompletePlugin.promoteNick('GamerzKit_TV');
    destiny.chat.gui.autoCompletePlugin.addNick('OverRustla');
    destiny.chat.gui.autoCompletePlugin.promoteNick('OverRustla');
    destiny.chat.onMSG({data:'Check tab completion of GameOfThrows and OverRustle',
        nick:'BetterDGG', features:[]});
};

let test3 = function() {
    destiny.chat.onMSG({data:'ChanChamp http://GabeN.com/foo?s=Riperino&p=DESBRO PJSalt',
        nick:'BetterDGG', features:[]});
};

let test4 = function() {
    destiny.chat.onMSG({data:'>green ChanChamp http://GabeN.com/foo?s=Riperino&p=DESBRO PJSalt',
        nick:'BetterDGG', features:['flair3']});
};

let chat = {
    disconnect: function() {
        destiny.chat.dontconnect = true;
        destiny.chat.sock.close();
    },

    login: function() {
        this.disconnect();
        $('#destinychat').replaceWith(templates.test_chat());
        ChatGui.prototype.emoticons = [];
        ChatGui.prototype.formatters = [];
        $('#destinychat').ChatGui({
            "nick": "BetterDGG", "features": []
        }, {"host":"www.destiny.gg","port":9998,"maxlines":150,"emoticons":["Abathur","AngelThump","ASLAN","AYYYLMAO","BasedGod","BASEDWATM8","BERN","BibleThump","CallCatz","CallChad","CheekerZ","DaFeels","DAFUK","DANKMEMES","DappaKappa","DatGeoff","DestiSenpaii","Disgustiny","DJAslan","Dravewin","DuckerZ","DURRSTINY","FeedNathan","FerretLOL","FIDGETLOL","FrankerZ","GameOfThrows","Heimerdonger","Hhhehhehe","HmmStiny","INFESTINY","Kappa","KappaRoss","Klappa","LeRuse","LIES","LUL","MASTERB8","Memegasm","MLADY","MotherFuckinGame","Nappa","NoTears","NOTMYTEMPO","OhKrappa","OverRustle","PEPE","PICNIC","Sippy","SLEEPSTINY","SoDoge","SoSad","SOTRIGGERED","SpookerZ","SURPRISE","SWEATSTINY","TRUMPED","UWOTM8","WEEWOO","WhoahDude","WORTH","YEE"],"twitchemotes":["nathanDad","nathanDank","nathanDubs1","nathanDubs2","nathanDubs3","nathanFather","nathanFeels","nathanParty"],"pmcountnum":0});
        //TODO: module?
        window.BetterDGG.init();
    },

    combo: function(emote, flair, nick, count) {
        emote = emote || 'DESBRO';
        var features = flair ? [ flair ] : [];
        nick = nick || 'BetterDGG';
        count = count || 5;
        for (var i=0; i<count; i++) {
            destiny.chat.onMSG({data:emote, nick:nick, features:features, timestamp:moment().valueOf()});
        }
    },

    emotes: function() {
        var all = emoticons.all;
        for (var i=0; i<all.length; i++) {
            destiny.chat.onMSG({data:all[i], nick:'BetterDGG', features:[]});
        }
    },

    broadcast: function(str) {
        str = str || 'BetterDGG is now a Tier II subscriber! gifted by 9inevolt OverRustle';
        destiny.chat.onBROADCAST({data:str});
    },

    info: function(str) {
        str = str || "Available commands: /emotes /me /ignore (without arguments to list the nicks ignored) /unignore /highlight (highlights target nicks messages for easier visibility) /unhighlight /maxlines /mute /unmute /subonly /ban /ipban /unban (also unbans ip bans) /timestampformat";
        push(new ChatInfoMessage(str));
    },

    status: function(str) {
        str = str || "Connecting to server...";
        push(new ChatStatusMessage(str));
    },

    error: function(str) {
        str = str || "Error contacting server";
        push(new ChatErrorMessage(str));
    },

    command: function(str) {
        str = str || "BetterDGG muted by Destiny";
        push(new ChatCommandMessage(str));
    },

    flair: function(str) {
        var msg = str || "hi there don't forget to try hiding all flair";
        destiny.chat.onMSG({data:msg, nick:'ILiedAboutCake', features:[]});
        destiny.chat.onMSG({data:msg, nick:'mellipelli', features:[]});
        destiny.chat.onMSG({data:msg, nick:'Zanshin314', features:[]});
        destiny.chat.onMSG({data:msg, nick:'Mannekino', features:[]});
        destiny.chat.onMSG({data:msg, nick:'downthecrop', features:[]});
    },

    highlight: function(str) {
        var msg = destiny.chat.user.username + " " + (str || "hi there");
        destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]});
    },

    ignore: function(str) {
        var msg = str || " ^nsfw$ ";
        destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[], timestamp:moment().valueOf()});
    },

    ignoreUser: function(user1, user2, msg) {
        var allUsers = Object.keys(destiny.chat.users);
        user1 = user1 || destiny.chat.users[allUsers[0]].username;
        user2 = user2 || destiny.chat.users[allUsers[1]].username;
        this.info('Ignore user messages from either ' + user1 + ' or ' + user2);
        this.mention(user1, user2, msg);
    },

    self: function(str, delay, timestamp) {
        var msgText = str || 'Message from self WhoahDude WhoahDude WhoahDude WhoahDude WhoahDude';
        delay = delay || 100;
        var m = new ChatUserMessage(msgText, destiny.chat.user);

        // Don't push self messages if they will combo (from gui.send)
        if (!$.inArray(msgText, destiny.chat.gui.emoticons)
                || !destiny.chat.previousemote || destiny.chat.previousemote.message != msgText) {
            push(m, 'pending');
        }

        setTimeout(function() {
            destiny.chat.onMSG({data:msgText, nick:destiny.chat.user.username, features:destiny.chat.user.features,
                    timestamp: timestamp || moment().valueOf()});
        }, delay);
    },

    inject: function(str) {
        destiny.chat.onMSG({data:(str || destiny.chat.user.username + ' <script type="text/javascript">' +
                'alert("hi there");</script><b>hi</b><br>there'),
            nick:'BetterDGG', features:['flair3']});
    },

    mention: function(user1, user2, msg) {
        var allUsers = Object.keys(destiny.chat.users);
        user1 = user1 || destiny.chat.users[allUsers[0]].username;
        user2 = user2 || destiny.chat.users[allUsers[1]].username;
        msg = msg || "hi there";
        destiny.chat.onMSG({data:msg + " " + user2, nick:user1, features:[]});
        destiny.chat.onMSG({data:msg + " " + user1, nick:user2, features:[]});
    },

    highlightMentions: function(user1, user2, msg) {
        var allUsers = Object.keys(destiny.chat.users);
        user1 = user1 || destiny.chat.users[allUsers[0]].username;
        user2 = user2 || destiny.chat.users[allUsers[1]].username;
        this.info('See if mentions of ' + user1 + ' or ' + user2 +
                ' are highlighted when selected');
        this.mention(user1, user2, msg);
    },

    // fake injected content in message
    security: function(str) {
        let usr = new ChatUser({nick:'BetterDGG', features:['flair2']});
        let msg = new ChatUserMessage(' ', usr);
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
    },

    override: function(str) {
        var msg = str || "SoSad";
        destiny.chat.onMSG({data:msg, nick:'BetterDGG', features:[]});
    },

    muted: function(str) {
        destiny.chat.onMUTE({data: 'BetterDGG'});
        var msg = str || "10m your past text";
        destiny.chat.onMSG({data:msg, nick:'Bot', features:[],
                timestamp:moment().valueOf()});
        destiny.chat.onERR('muted');
    },

    privmsg: function(messageid, msg, nick) {
        msg = msg || 'private message Memegasm';
        nick = nick || 'BetterDGG';
        messageid = messageid || 12345;
        destiny.chat.onPRIVMSG({data:msg, nick:nick, messageid: messageid, features:[]});
    },
};

let or = {
    twitch: function(str) {
        destiny.chat.onMSG({data:str || 'visit http://www.twitch.tv/9inevolt',
            nick:'BetterDGG', features:['flair1']});
    },

    hitbox: function(str) {
        destiny.chat.onMSG({data:str || 'visit http://www.hitbox.tv/9inevolt',
            nick:'BetterDGG', features:['flair1']});
    },

    castamp: function(str) {
        destiny.chat.onMSG({data:str || 'visit http://castamp.com/live/9inevolt',
            nick:'BetterDGG', features:['flair1']});
    },

    ustream: function(str) {
        destiny.chat.onMSG({data:str || 'visit http://www.ustream.tv/embed/6299343',
            nick:'BetterDGG', features:['flair1']});
    },

    ustream2: function(str) {
        destiny.chat.onMSG({data:str || 'visit http://www.ustream.tv/channel/JoeRogan',
            nick:'BetterDGG', features:['flair1']});
    },

    ustream3: function(str) {
        destiny.chat.onMSG({data:str || 'visit http://www.ustream.tv/z',
            nick:'BetterDGG', features:['flair1']});
    },

    not: function(str) {
        destiny.chat.onMSG({data:str || 'no http before destiny.gg',
            nick:'BetterDGG', features:['flair1']});
    },
};

let slot = function(str, delay, timestamp) {
    chat.self(str || 'BAR BAR BAR', delay, timestamp);
};

let subreddit = function(str) {
    destiny.chat.onMSG({data:str || '/r/destiny! also /r/fallout_shelter, /r/starcraft? maybe /r/games',
        nick:'BetterDGG', features:['flair1']});
};

let emoji = {
    test: function(msg = "Gun: \ud83d\udd2b") {
        bdgg_push(msg);
    },

    uc9: function(msg = "Raised Hand: \ud83e\udd1a, Pancakes: \ud83e\udd5e")
    {
        bdgg_push(msg);
    },

    // https://github.com/Ranks/emojione/issues/320
    variant: function(msg = "Stadium: \ud83c\udfdf, Stadium2: \ud83c\udfdf\ufe0f") {
        bdgg_push(msg);
    },

    diversity: function(msg = "\u26f9, w: \u26f9\ud83c\udffb, lb: \u26f9\ud83c\udffc") {
        bdgg_push(msg);
    },

    join: function(msg = "\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc69") {
        bdgg_push(msg);
    },
};

let test = { chat, emoji, or, slot, subreddit, test1, test2, test3, test4 };

export default test
