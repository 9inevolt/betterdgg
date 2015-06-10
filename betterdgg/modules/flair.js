;(function(bdgg) {
    var CONTRIBUTORS = [ '9inevolt', 'mellipelli' ];

    function _getSid() {
        try {
            $.cookie.json = false;
            return $.cookie('sid');
        } finally {
            $.cookie.json = true;
        }
    }

    function _getCountry() {
        window.postMessage({type: 'bdgg_get_profile_info'}, '*');
    }

    function _processFlair() {
        // Avoid redundant off request
        var currentUser = bdgg.users.get(destiny.chat.user.username);
        if (!_displayCountry && !currentUser) {
            return;
        }

        var data = {
            type: 'bdgg_flair_update',
            displayCountry: _displayCountry,
            username: destiny.chat.user.username,
            sid: _getSid()
        };

        if (!_displayCountry || !currentUser) {
            window.postMessage(data, '*');
        } else {
            _tid = setTimeout(function() {
                window.postMessage(data, '*');
            }, 7000);

            var listener = function(e) {
                if (window != e.source || e.data.type != 'bdgg_profile_info' ) {
                    return;
                }

                if (e.data.info && e.data.info['country'] == currentUser.country) {
                    // Avoid redundant on request
                    clearTimeout(_tid);
                }
            };
            window.addEventListener('message', listener);
            _getCountry();
        }
    }

    var _tid = null;
    var _displayCountry = false;
    var _displayAllCountries = true;
    var _listener = null;

    bdgg.flair = (function() {
        destiny.UserFeatures['BDGG_CONTRIBUTOR'] = 'bdgg_contributor';
        var fnGetFeatureHTML = ChatUserMessage.prototype.getFeatureHTML;
        var bdggGetFeatureHTML = function() {
            var icons = fnGetFeatureHTML.apply(this, arguments);
            if (CONTRIBUTORS.indexOf(this.user.username) > -1) {
                icons += '<i class="icon-bdgg-contributor" title="Better Destiny.gg Contributor"/>';
            }

            if (_displayAllCountries) {
                if (user = bdgg.users.get(this.user.username)) {
                    var a2 = user.country.substring(0, 2).toUpperCase();
                    var flagClass = "icon-bdgg-flag flag-" + a2.toLowerCase();
                    var country = bdgg.countries.get(a2);
                    if (country) {
                        var flagIcon = '<i class="' + flagClass + '" '
                            + 'title="' + country['name'] + '"/>';
                        icons = flagIcon + icons;
                    }
                }
            }
            return icons;
        };
        ChatUserMessage.prototype.getFeatureHTML = bdggGetFeatureHTML;
        return {
            init: function() {
                bdgg.flair.displayCountry(bdgg.settings.get('bdgg_flair_country_display'), 3000);
                bdgg.flair.displayAllCountries(bdgg.settings.get('bdgg_flair_all_country_display'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_flair_country_display') {
                        bdgg.flair.displayCountry(value);
                    } else if (key == 'bdgg_flair_all_country_display') {
                        bdgg.flair.displayAllCountries(value);
                    }
                });
            },
            displayCountry: function(value, wait) {
                _displayCountry = value;
                if (_tid != null) {
                    clearTimeout(_tid);
                }

                if (wait != null && wait > 0) {
                    setTimeout(_processFlair, wait);
                } else {
                    _processFlair();
                }
            },
            displayAllCountries: function(value) {
                _displayAllCountries = value;
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
