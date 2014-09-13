function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn.toString() + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

exec(function() {
    var EMOTICONS = [ "ASLAN", "CallChad", "DJAslan", "FIDGETLOL",
        "CallCatz", "DESBRO", "Dravewin", "TooSpicy"
    ];
    var emoticons = EMOTICONS.filter(function(e) { return destiny.chat.gui.emoticons.indexOf(e) == -1 });
    destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons);
    $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addData(v, 2) });

    var BDGGEmoteFormatter = {
        bdggemoteregex: new RegExp('\\b('+emoticons.join('|')+')\\b', 'gm'),

        format: function(str, user) {
            return str.replace(this.bdggemoteregex, '<div title="$1" class="chat-emote bdgg-chat-emote-$1"></div>');
        }
    };

    destiny.chat.gui.formatters.push(BDGGEmoteFormatter);

    // multi-emote
    $.each(destiny.chat.gui.formatters, function(i, f) {
        if (f && f.hasOwnProperty('emoteregex') && f.hasOwnProperty('gemoteregex')) {
            f.emoteregex = f.gemoteregex;
            return false;
        }
    });

    // deleted messages
    destiny.chat.gui.removeUserMessages = function(username) {
        this.lines.children('div[data-username="'+username.toLowerCase()+'"]').each(function() {
            $(this).find('.msg').css('color', '#555');
            $(this).find('.greentext').css('color', '#286100');
            $(this).find('div.chat-emote').css('opacity', 0.25);
            $(this).find('a.externallink').each(function() {
                var rawLink = "<span style=\"text-decoration: line-through;\">" + $(this).attr("href").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</span>";
                $(this).replaceWith(rawLink);
            });
        }); 
    };

    // >greentext
    var BDGGGreenTextFormatter = {
        format: function(str, user) {
            var loc = str.indexOf("&gt;")
            if(loc === 0){
                str = '<span class="greentext">'+str+'</span>';
            }
            return str;
        }
    }
    
    destiny.chat.gui.formatters.push(BDGGGreenTextFormatter);

    console.log("Better destiny.gg v0.2.0 loaded");
});
