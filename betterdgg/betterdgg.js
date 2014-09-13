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
        emoteregex: new RegExp('(^|[\\s,\\.\\?!])('+emoticons.join('|')+')(?=$|[\\s,\\.\\?!])'),
        gemoteregex: new RegExp('(^|[\\s,\\.\\?!])('+emoticons.join('|')+')(?=$|[\\s,\\.\\?!])', 'gm'),

        format: function(str, user) {
            var emoteregex = (user && ((user.features || []).length > 0)) ? this.gemoteregex:this.emoteregex;
            return str.replace(emoteregex, '$1<div title="$2" class="chat-emote bdgg-chat-emote-$2"></div>');
        }
    };

    destiny.chat.gui.formatters.push(BDGGEmoteFormatter);

    destiny.chat.gui.removeUserMessages = function(username) {
        this.lines.children('div[data-username="'+username.toLowerCase()+'"]').each(function() {
            $(this).find('.msg').css('color', '#555');
            $(this).find('div.chat-emote').css('opacity', 0.25);
            $(this).find('a.externallink').each(function() {
                var rawLink = "<span style=\"text-decoration: line-through;\">" + $(this).attr("href").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</span>";
                $(this).replaceWith(rawLink);
            });
        }); 
    };

    // >greentext
    destiny.fn.GreenTextFormatter = function(chat){
        return this;
    }
    destiny.fn.GreenTextFormatter.prototype.format = function(str, user){
        var loc = str.indexOf("&gt;")
        if(loc != -1 && loc == 0){
            str = '<span style="color:#6ca528">'+str+'</span>';
        }
        return str;
    }
    
    destiny.chat.gui.formatters.push(new destiny.fn.GreenTextFormatter(destiny.chat.gui));

    console.log("Better destiny.gg v0.1.1 loaded");
});