// TODO: find a cleaner way to load this
window.BetterDGG.settings.init();
window.BetterDGG.emoticons.init();
window.BetterDGG.overrustle.init();
window.BetterDGG.stalk.init();
window.BetterDGG.theme.init();

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

//console.log("Better destiny.gg v0.4.2 loaded");
