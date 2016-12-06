import settings from './settings';

let _enabled = false;

let mentions = {
    init: function() {
        this.highlightSelected(settings.get('bdgg_highlight_selected_mentions'));
        settings.on('bdgg_highlight_selected_mentions', value => { this.highlightSelected(value); });

        var gui = window.destiny.chat.gui;

        var contentFilter = function(username) {
            return function() {
                return this.nodeType == 3 && this.textContent != null
                    && this.textContent.toLowerCase() === username;
            };
        };

        gui.lines.on('mousedown', '.user-msg a.user', function() {
            if (_enabled) {
                var username = $(this).text();
                gui.lines
                    .find('span.chat-user:contains(' + username + ')')
                    .closest(gui.lines.children())
                    .addClass('bdgg-focused');
            }
        });

        var fnClearUserFocus = gui.clearUserFocus;

        gui.clearUserFocus = function() {
            fnClearUserFocus.apply(this, arguments);
            gui.lines.children('.bdgg-focused').removeClass('bdgg-focused');
        };
    },
    highlightSelected: function(value) {
        _enabled = value;
    }
};

export default mentions;
