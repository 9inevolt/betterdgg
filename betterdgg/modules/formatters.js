;(function(bdgg) {
    bdgg.formatters = (function() {
        return {
            init: function() {
                // deleted messages
                destiny.chat.gui.removeUserMessages = function(username) {
                    this.lines.children('div[data-username="'+username.toLowerCase()+'"]').addClass('bdgg-muted');
                };

                $(destiny.chat.gui.lines).on('click', '.bdgg-muted a.externallink', function(e) {
                    return false;
                });

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
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
