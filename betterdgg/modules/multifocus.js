;(function(bdgg) {
    bdgg.multifocus = (function() {
        function _toggleFocus(user) {
            destiny.chat.gui.lines.find('div[data-username="'+user+'"]').toggleClass('focused');
        }

        return {
            init: function() {
                var BDGGMentionedUserFormatter = {
                    format: function(str, user) {
                        var wrapped = $('<span>').append(str);
                        wrapped.find('span').addBack().contents().filter(function() { return this.nodeType == 3})
                            .replaceWith(function() {
                                ss = this.data.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                                    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                                    .split(' ');
                                ss.forEach(function(s, i) {
                                    if (destiny.chat.users.propertyIsEnumerable(s)) {
                                        ss[i] = '<span class="bdgg-user">' + s + '</span>';
                                    }
                                });
                                return ss.join(' ');
                            });

                        return wrapped.html();
                    }
                }

                destiny.chat.gui.lines.on('mousedown', '.user-msg .bdgg-user', function(e) {
                    var user = this.textContent.toLowerCase();
                    if (destiny.chat.gui.cUserTools.visible) {
                        _toggleFocus(user);
                    } else {
                        destiny.chat.gui.cUserTools.show(this.textContent, user, destiny.chat.users[user]);
                        var speaker = $(this).closest('.user-msg').data('username');
                        _toggleFocus(speaker);
                    }
                    e.stopImmediatePropagation();
                });

                destiny.chat.gui.formatters.push(BDGGMentionedUserFormatter);
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
