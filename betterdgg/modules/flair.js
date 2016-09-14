(function(bdgg) {

    var BOTS = [];
    var CONTRIBUTORS = [ 'downthecrop', 'PurpleCow', 'SgtMaximum', 'Sweetie_Belle', 'Polecat', 'Dashh' ];
    var MOOBIES = [ 'Humankillerx', 'loldamar', 'Nate', 'Overpowered', 'Mannekino',
                    'Zanshin314', 'Tassadar', 'Bombjin', 'DaeNda', 'StoopidMonkey',
                    'Funnyguy17', 'Derugo', 'Fancysloth', 'dawigas', 'DerFaba', 'ShawarmaFury'
                  ];
    var ALERT_MSG = '<p>To display or hide your country flair, please '
        + '<a target="_blank" href="https://www.destiny.gg/profile/authentication">create</a> '
        + 'a destiny.gg login key.</p>';

    function _getToken() {
        try {
            var response = $.ajax(window.location.origin + '/profile/authentication', {
                async: false,
                timeout: 3000
            });

            if (response.status === 200) {
                var tokenLinks = $(response.responseText).find("a[href^='/profile/authtoken/']");
                if (tokenLinks.length > 0) {
                    var href = tokenLinks[0].getAttribute('href');
                    var matches;
                    if (matches = /^\/profile\/authtoken\/(\w+)/.exec(href)) {
                        return matches[1];
                    }
                } else {
                    bdgg.alert.show(ALERT_MSG);
                }
            }
        } catch (e) { console.warn(e); }
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
            token: _getToken()
        };

        if (!_displayCountry || !currentUser) {
            window.postMessage(data, '*');
        } else {
            _tid = setTimeout(function() {
                window.postMessage(data, '*');
            }, 7000);

            var listener = function(e) {
                if (window !== e.source || e.data.type !== 'bdgg_profile_info') {
                    return;
                }

                if (e.data.info && e.data.info['country'] === currentUser.country) {
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
    var _hideAll = false;
    var _hideEvery = false;

    bdgg.flair = (function() {
        destiny.UserFeatures['BDGG_CONTRIBUTOR'] = 'bdgg_contributor';
        destiny.UserFeatures['BDGG_MOOBIE'] = 'bdgg_moobie';

        var fnGetFeatureHTML = ChatUserMessage.prototype.getFeatureHTML;
        var bdggGetFeatureHTML = function() {
            var icons = fnGetFeatureHTML.apply(this, arguments);

            //This comes first because Bot wasn't getting his flair sometimes
            if (BOTS.indexOf(this.user.username) > -1) {
                icons += '<i class="icon-bot" title="Bot"/>';
            }

            if (_hideEvery) {
                icons = ''; //Clear the emote string to set to nothing
                return icons;
            }

            if (_hideAll) {
                return icons;
            }

            if (CONTRIBUTORS.indexOf(this.user.username) > -1) {
                icons += '<i class="icon-bdgg-contributor" title="Better Better Destiny.gg Contributor"/>';
                if (this.user.username === 'downthecrop'){
                    icons = icons.replace('<i class="icon-evenotable" title="Eve Notable"/>','');
                }
            }

            if (MOOBIES.indexOf(this.user.username) > -1) {
                icons += '<i class="icon-bdgg-moobie" title="Movie Streamer"/>';
            }


            if (_displayAllCountries) {
                var user;
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
                bdgg.flair.hideAll(bdgg.settings.get('bdgg_flair_hide_all'));
                bdgg.flair.hideEvery(bdgg.settings.get('bdgg_flair_hide_every'));

                bdgg.settings.addObserver(function(key, value) {
                    if (key === 'bdgg_flair_country_display') {
                        bdgg.flair.displayCountry(value);
                    }
                    else if (key === 'bdgg_flair_all_country_display') {
                        bdgg.flair.displayAllCountries(value);
                    }
                    else if (key === 'bdgg_flair_hide_all') {
                        bdgg.flair.hideAll(value);
                    }
                    else if (key === 'bdgg_flair_hide_every') {
                        bdgg.flair.hideEvery(value);
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
                }
                else {
                    _processFlair();
                }
            },
            displayAllCountries: function(value) {
                _displayAllCountries = value;
            },
            hideAll: function(value) {
                _hideAll = value;
            },
            hideEvery: function(value) {
                _hideEvery = value;
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
