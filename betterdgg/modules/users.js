import { postMessage } from '../messaging';

var _users = {};

function refreshed(users) {
    _users = users;
}

function _initUsers() {
    var listener = function(e) {
        if (window != e.source) {
            return;
        }

        if (e.data.type == 'bdgg_users_refreshed') {
            refreshed(e.data.users);
        }
    };
    window.addEventListener('message', listener);
}

let users = {
    init: function() {
        _initUsers();
        setTimeout(() => this.refresh(), 1000);
    },
    get: function(username) {
        return _users[username];
    },
    refresh: function() {
        postMessage('bdgg_users_refresh')
            .then(data => { refreshed(data.users); })
            .catch(err => { console.error(err); });
    }
};

export default users;
