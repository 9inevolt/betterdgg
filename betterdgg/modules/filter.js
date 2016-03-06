;(function(bdgg) {
    bdgg.filter = (function() {
        var _filterRe;

        function _filterWords(value) {
            var words = value.split(',')
                .map(function(val) {
                    return val.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                })
                .reduce(function(prev, curr) {
                    if (curr.length > 0) {
                        prev.push(curr);
                    }
                    return prev;
                }, []);

            if (words.length > 0) {
                _filterRe = new RegExp("(?:^|\\b|\\s)(?:"+words.join("|")+")(?:$|\\b|\\s)", "i");
            } else {
                _filterRe = null;
            }
        }

        return {
            init: function() {
                _filterWords(bdgg.settings.get('bdgg_filter_words'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_filter_words') {
                        _filterWords(value);
                    }
                });

                var fnGuiPush = destiny.chat.gui.push;
                destiny.chat.gui.push = function(msg) {
                    if (_filterRe != null && msg instanceof ChatUserMessage) {
                        if (_filterRe.test(msg.message)) {
                            return;
                        }
                    }

                    return fnGuiPush.apply(this, arguments);
                };
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
