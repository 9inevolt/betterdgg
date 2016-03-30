(function(bdgg) {
    var _users = {};

    function _initUsers() {
        var listener = function(e) {
            if (window !== e.source) {
                return;
            }

            if (e.data.type === 'bdgg_users_refreshed') {
                _users = e.data.users;
            }
        };
        window.addEventListener('message', listener);
    }

    bdgg.users = (function() {
        return {
            init: function() {
                _initUsers();
                setTimeout(bdgg.users.refresh, 1000);
            },
            get: function(username) {
                return _users[username];
            },
            refresh: function() {
                window.postMessage({type: 'bdgg_users_refresh'}, '*');
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
