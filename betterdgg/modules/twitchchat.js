import * as templates from './templates';

let twitchchat = {
    init: function() {
        var document = window.parent.document;

        // only run on destiny.gg/bigscreen
        if (!document.URL.includes('destiny.gg/bigscreen')) {
            return;
        }

        // add toggle button to upper-right
        var toprightbar = $('ul.nav.navbar-nav.navbar-right', document);
        var twitchButton = $('<li><a href="#">Twitch Chat</a></li>');

        if (toprightbar.prop('outerHTML').indexOf('Chat') < 0) {
            toprightbar.prepend(twitchButton);
        }

        var dggchat = $('#chat-wrap', document);
        dggchat.addClass('tab-pane fade active in');

        var twitchSelected = false;
        var twitchchatpanel;

        twitchButton.click(function onClick() {
            // lazily load twitch chat when it is actually desired
            if (!twitchchatpanel) {
                // embed iframe
                var chatpanel = $('#chat-panel', document);
                twitchchatpanel = $(templates.twitch_chat());
                twitchchatpanel.addClass('tab-pane fade');
                chatpanel.append(twitchchatpanel);
                chatpanel.addClass('tab-content');
            }

            dggchat.toggleClass('active in');
            twitchchatpanel.toggleClass('active in');

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

export default twitchchat;
