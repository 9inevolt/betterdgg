(function(bdgg) {

    var REMOTE_FLAIR, REMOTE_NICKNAMES = [];
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

    function _stripSpecial(value){
        return value.replace(/<\/?[^>]+(>|$)/g, "");
    }

    function _getRemoteFlairs() {
        if (!_hideAll){
            window.postMessage({type: 'bdgg_flair_request'}, '*');
            setTimeout(_getRemoteFlairs,60000);
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
            token: _getToken()
        };

        if (!_displayCountry || !currentUser) {
            window.postMessage(data, '*');
        } else {
            _tid = setTimeout(function() {
                window.postMessage(data, '*');
            }, 7000);

            var listener = function(e) {
                if (window !== e.source) {
                    return;
                }
                if (e.data.type === 'bdgg_flair_reply') {
                    REMOTE_FLAIR = e.data.response.users;
                    if (REMOTE_FLAIR != null) {
                        REMOTE_NICKNAMES = [];
                        for (var i = 0; i < REMOTE_FLAIR.length; i++) {
                            REMOTE_NICKNAMES.push(REMOTE_FLAIR[i].nick.toLowerCase());
                        }
                    }
                }
                else if (e.data.type === 'bdgg_flair_error') {
                    destiny.chat.gui.push(new ChatErrorMessage("Couldn't gather BBDGG flairs"));
                }
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

    bdgg.flair = (function() {
        destiny.UserFeatures['BDGG_CONTRIBUTOR'] = 'bdgg_contributor';
        destiny.UserFeatures['BDGG_MOOBIE'] = 'bdgg_moobie';

        var fnGetFeatureHTML = ChatUserMessage.prototype.getFeatureHTML;
        var bdggGetFeatureHTML = function() {
            var icons = fnGetFeatureHTML.apply(this, arguments);

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

            if (_hideAll) {
                return icons;
            }

            if (REMOTE_NICKNAMES.indexOf(this.user.username.toLowerCase()) > -1) {
                var nameIndex = REMOTE_NICKNAMES.indexOf(this.user.username.toLowerCase());
                if (REMOTE_FLAIR[nameIndex].flairs.length != null){
                    for (var i = 0; i < REMOTE_FLAIR[nameIndex].flairs.length; i++) {
                        if (i%2 !== 1){
                            icons += '<i class="icon-bdgg-'+_stripSpecial(REMOTE_FLAIR[nameIndex].flairs[i])+'" title="'+_stripSpecial(REMOTE_FLAIR[nameIndex].flairs[i+1])+'"/>';
                        }
                    }
                }
            }

            return icons;
        };

        ChatUserMessage.prototype.getFeatureHTML = bdggGetFeatureHTML;
        return {
            init: function() {

                bdgg.flair.displayCountry(bdgg.settings.get('bdgg_flair_country_display'), 3000);
                bdgg.flair.flairRequest(3500);
                bdgg.flair.displayAllCountries(bdgg.settings.get('bdgg_flair_all_country_display'));
                bdgg.flair.hideAll(bdgg.settings.get('bdgg_flair_hide_all'));

                bdgg.settings.addObserver(function(key, value) {
                    if (key === 'bdgg_flair_country_display') {
                        bdgg.flair.displayCountry(value);
                    }
                    else if (key === 'bdgg_flair_all_country_display') {
                        bdgg.flair.displayAllCountries(value);
                    }
                    else if (key === 'bdgg_flair_hide_all') {
                        bdgg.flair.hideAll(value);
                        bdgg.flair.flairRequest(2500);
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
            flairRequest: function(wait) {
                if (!_hideAll){
                    if (_tid != null) {
                        clearTimeout(_tid);
                    }
                    if (wait != null && wait > 0) {
                        setTimeout(_getRemoteFlairs, wait);
                    }
                    else {
                        _getRemoteFlairs();
                    }
                }
            },
            displayAllCountries: function(value) {
                _displayAllCountries = value;
            },
            hideAll: function(value) {
                _hideAll = value;
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
