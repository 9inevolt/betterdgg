(function(bdgg) {
    bdgg.mentions = (function() {
        return {
            init: function() {
                var gui = window.destiny.chat.gui;

                gui.lines.on('mousedown', 'div.user-msg a.user', function() {
                    if (bdgg.settings.get('bdgg_highlight_selected_mentions')) {
                        var username = $(this).text();
                        gui.lines.find(':contains(' + username + ')').addClass('focused');
                    }

                    return false;
                });
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
