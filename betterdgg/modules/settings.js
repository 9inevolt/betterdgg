;(function(bdgg) {
    var SETTINGS = [
        [ 'bdgg_emote_tab_priority', 'Prioritize emotes',
            'Prioritize emotes for tab completion', true ],

        [ 'bdgg_emote_override', 'Override emotes',
            'Override some emotes', true ],

        [ 'bdgg_light_theme', 'Light theme',
            'Light chat theme', false ],

        [ 'bdgg_convert_overrustle_links',
            'Convert stream links to overrustle',
            'Auto-converts stream links to use overrustle.com.',
            false ]
    ];

    bdgg.settings = (function() {
        var _observers = [];

        var _notify = function(key, value) {
            for (var i = 0; i < _observers.length; i++) {
                _observers[i].call(this, key, value);
            }
        };

        var _getSetting = function(key, name, description, defValue) {
            return {
                key: key,
                name: name,
                value: bdgg.settings.get(key, defValue),
                description: description
            };
        };

        return {
            init: function() {
                $('#destinychat .chat-tools-wrap').prepend(bdgg.templates.menu_button());
                $('#chat-bottom-frame').append(
                    $(bdgg.templates.menu()).append(
                        bdgg.templates.menu_footer({version: bdgg.version})));

                $('#bdgg-settings-btn').on('click', function(e) {
                    $('#bdgg-settings').toggle();
                    $(this).toggleClass('active');
                    window.cMenu.closeMenus(destiny.chat.gui);
                });

                $('#bdgg-settings .close').on('click', function(e) {
                    bdgg.settings.hide();
                });

                for (var i=0; i<SETTINGS.length; i++) {
                    bdgg.settings.add(_getSetting.apply(this, SETTINGS[i]));
                }

                destiny.chat.gui.chatsettings.btn.on('click', bdgg.settings.hide);
                destiny.chat.gui.userslist.btn.on('click', bdgg.settings.hide);
            },
            addObserver: function(obs) {
                if (_observers.indexOf(obs) < 0) {
                    _observers.push(obs);
                }
            },
            removeObserver: function(obs) {
                var i = _observers.indexOf(obs);
                if (i > -1) {
                    _observers.splice(i, 1);
                    return true;
                }
                return false;
            },
            hide: function() {
                $('#bdgg-settings').hide();
                $('#bdgg-settings-btn').removeClass('active');
            },
            add: function(setting) {
                $('#bdgg-settings ul').append(bdgg.templates.menu_checkbox({setting: setting}));
                $('#bdgg-settings input[type="checkbox"]#' + setting.key).on('change', function(e) {
                    var value = $(this).prop('checked');
                    bdgg.settings.put(setting.key, value);
                });
            },
            get: function(key, defValue) {
                var value = localStorage.getItem(key);
                if (value == null) {
                    value = defValue;
                    bdgg.settings.put(key, defValue);
                } else if (value === "true") {
                    value = true;
                } else if (value === "false") {
                    value = false;
                }
                return value;
            },
            put: function(key, value) {
                localStorage.setItem(key, value);
                _notify(key, value);
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
