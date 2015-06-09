;(function(bdgg) {
    var CONTRIBUTORS = [ '9inevolt', 'ILiedAboutCake', 'mellipelli' ];

    function _getSid() {
        try {
            $.cookie.json = false;
            return $.cookie('sid');
        } finally {
            $.cookie.json = true;
        }
    }

    bdgg.flair = (function() {
        var _displayCountry = false;

        destiny.UserFeatures['BDGG_CONTRIBUTOR'] = 'bdgg_contributor';
        var fnGetFeatureHTML = ChatUserMessage.prototype.getFeatureHTML;
        var bdggGetFeatureHTML = function() {
            var icons = fnGetFeatureHTML.apply(this, arguments);
            if (CONTRIBUTORS.indexOf(this.user.username) > -1) {
                icons += '<i class="icon-bdgg-contributor" title="Better Destiny.gg Contributor"/>';
            }

            if (user = bdgg.users.get(this.user.username)) {
                var a2 = user.country.substring(0, 2).toUpperCase();
                var flagClass = "icon-bdgg-flag flag-" + a2.toLowerCase();
                var country = bdgg.countries.get(a2);
                icons += '<i class="' + flagClass + '"';
                if (country) {
                    icons += ' title="' + country['name'] + '"';
                }
                icons += '/>';
            }
            return icons;
        };
        ChatUserMessage.prototype.getFeatureHTML = bdggGetFeatureHTML;
        return {
            init: function() {
                bdgg.flair.displayCountry(bdgg.settings.get('bdgg_flair_country_display'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_flair_country_display') {
                        bdgg.flair.displayCountry(value);
                    }
                });
            },
            displayCountry: function(value) {
                _displayCountry = value;

                if (!value && !bdgg.users.get(destiny.chat.user.username)) {
                    // Avoid redundant off request
                    return;
                }

                var data = {
                    type: 'bdgg_flair_update',
                    displayCountry: value,
                    username: destiny.chat.user.username,
                    sid: _getSid()
                };
                window.postMessage(data, '*');
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
