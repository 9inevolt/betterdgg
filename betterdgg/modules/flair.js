import _get from 'lodash.get';
import promiseFinally from 'promise-finally';
import xhr from 'xhr';
import { postMessage } from '../messaging';
import alert from './alert';
import countries from './countries';
import settings from './settings';
import users from './users';

var CONTRIBUTORS = [ '9inevolt', 'mellipelli' ];
let REMOTE_NICKNAMES = new Map();
var ALERT_MSG = '<p>To display or hide your country flair, please '
    + '<a target="_blank" href="https://www.destiny.gg/profile/authentication">create</a> '
    + 'a destiny.gg login key.</p>';

function _getToken() {
    const options = {
        method: 'GET',
        url: window.location.origin + '/profile/authentication',
        timeout: 3000
    };

    return new Promise((resolve, reject) => {
        xhr(options, (err, resp, body) => {
            if (!!err) {
                reject(err);
            } else if (resp.statusCode !== 200) {
                reject(resp);
            } else {
                const tokenLinks = $(body).find("a[href^='/profile/authtoken/']");
                if (tokenLinks.length > 0) {
                    const href = tokenLinks[0].getAttribute('href');
                    let matches;
                    if (matches = /^\/profile\/authtoken\/(\w+)/.exec(href)) {
                        resolve(matches[1]);
                    }
                } else {
                    alert.show(ALERT_MSG);
                    reject();
                }
            }
        });
    });
}

function _getRemoteFlairs() {
    if (!_hideAll) {
        const p = postMessage('bdgg_flair_request').then(response => {
            REMOTE_NICKNAMES.clear();
            let remote_users = _get(response, 'users', []);
            for (let user of remote_users) {
                REMOTE_NICKNAMES.set(_get(user, 'nick').toLowerCase(), _get(user, 'flairs', []));
            }
        });

        promiseFinally(p, () => {
            clearTimeout(_rtid);
            _rtid = setTimeout(_getRemoteFlairs, 60000);
        });
    }
}

function _getCountry() {
    return postMessage('bdgg_get_profile_info').then(info => {
        let currentUser = users.get(destiny.chat.user.username);

        if (info && info['country'] == currentUser.country) {
            return false;
        }

        return true;
    });
}

function updateFlair(data) {
    return postMessage('bdgg_flair_update', data).catch(err => {
        console.error(err);
    });
}

function _processFlair() {
    // Avoid redundant off request
    var currentUser = users.get(destiny.chat.user.username);
    if (!_displayCountry && !currentUser) {
        return;
    }

    _getToken().then(token => {
        const data = {
            displayCountry: _displayCountry,
            username: destiny.chat.user.username,
            token
        };

        if (!_displayCountry || !currentUser) {
            // Request required
            updateFlair(data);
        } else {
            _getCountry().then(updated => {
                // Avoid redundant on request
                if (updated) {
                    return updateFlair(data);
                }
            });
        }
    })
    .catch(err => {
        if (err) {
            console.error(err);
        }
    });
}

var _rtid = null;
var _displayCountry = false;
var _displayAllCountries = true;
var _hideAll = false;

var fnGetFeatureHTML;
var bdggGetFeatureHTML = function() {
    var icons = fnGetFeatureHTML.apply(this, arguments);

    if (_displayAllCountries) {
        let user = users.get(this.user.username);
        if (user) {
            let a2 = user.country.substring(0, 2).toUpperCase();
            let flagClass = "icon-bdgg-flag flag-" + a2.toLowerCase();
            let country = countries.get(a2);
            if (country) {
                let flagIcon = '<i class="' + flagClass + '" '
                    + 'title="' + country['name'] + '"/>';
                icons = flagIcon + icons;
            }
        }
    }

    if (_hideAll) {
        return icons;
    }

    if (CONTRIBUTORS.indexOf(this.user.username) > -1) {
        icons += '<i class="icon-bdgg-contributor" title="Better Destiny.gg Contributor"/>';
    }

    let flairs = REMOTE_NICKNAMES.get(this.user.username.toLowerCase());
    if (flairs) {
        for (let i = 0; i < flairs.length-1; i+=2) {
            let feature = flairs[i];
            let title = flairs[i+1];
            let className = feature == 'contributor' ? 'icon-bbdgg-contributor' : `icon-bdgg-${feature}`;
            let icon = $('<i>').addClass(className).attr('title', title);
            icons += icon[0].outerHTML;
        }
    }

    return icons;
};

let flair = {
    init: function() {
        destiny.UserFeatures['BDGG_CONTRIBUTOR'] = 'bdgg_contributor';
        destiny.UserFeatures['BDGG_MOOBIE'] = 'bdgg_moobie';
        fnGetFeatureHTML = ChatUserMessage.prototype.getFeatureHTML;
        ChatUserMessage.prototype.getFeatureHTML = bdggGetFeatureHTML;

        this.displayCountry(settings.get('bdgg_flair_country_display'), 3000);
        this.flairRequest(3500);
        this.displayAllCountries(settings.get('bdgg_flair_all_country_display'));
        this.hideAll(settings.get('bdgg_flair_hide_all'));

        settings.on('bdgg_flair_country_display', value => { this.displayCountry(value); });
        settings.on('bdgg_flair_all_country_display', value => { this.displayAllCountries(value); });
        settings.on('bdgg_flair_hide_all', value => {
            this.hideAll(value);
            this.flairRequest(2500);
        });
    },
    displayCountry: function(value, wait) {
        _displayCountry = value;

        if (wait != null && wait > 0) {
            setTimeout(_processFlair, wait);
        } else {
            _processFlair();
        }
    },
    flairRequest: function(wait) {
        if (!_hideAll) {
            clearTimeout(_rtid);
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

export default flair;
