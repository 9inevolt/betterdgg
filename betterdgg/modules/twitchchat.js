(function(bdgg) {
    bdgg.twitchchat = (function() {
        return {
            init: function() {
                var document = window.parent.document;

                // only run on destiny.gg/bigscreen
                if (!document.URL.includes('destiny.gg/bigscreen')) {
                    return;
                }

                // add toggle button to upper-right
                var toprightbar = $('ul.nav.navbar-nav.navbar-right', document);
                var twitchButton = $('<li><a href="#">Twitch Chat</a></li>');
                toprightbar.prepend(twitchButton);

                var dggchat = $('#chat-wrap', document);
                dggchat.addClass('tab-pane fade active in');

                var twitchSelected = false;
                var twitchchat;

                twitchButton.click(function onClick() {

                    // lazily load twitch chat when it is actually desired
                    if (!twitchchat) {

                        // embed iframe
                        var chatpanel = $('#chat-panel', document);
                        twitchchat = $(bdgg.templates.twitch_chat());
                        twitchchat.addClass('tab-pane fade');
                        chatpanel.append(twitchchat);
                        chatpanel.addClass('tab-content');
                    }

                    dggchat.toggleClass('active in');
                    twitchchat.toggleClass('active in');

                    if (twitchSelected) {
                        $('a', twitchButton).text('Twitch Chat');
                    }
                    else {
                        $('a', twitchButton).text('Destiny Chat');
                    }

                    twitchSelected = !twitchSelected;
                });
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
