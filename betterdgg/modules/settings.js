import * as templates from './templates';
import version from './version';

var SETTINGS = {
    'bdgg_emote_tab_priority': {
        'name': 'Prioritize emotes',
        'description': 'Prioritize emotes for tab completion',
        'value': true,
        'type': 'boolean'
    },

    'bdgg_emote_override': {
        'name': 'Override emotes',
        'description': 'Override some emotes',
        'value': true,
        'type': 'boolean'
    },

    'bdgg_light_theme': {
        'name': 'Light theme',
        'description': 'Light chat theme',
        'value': false,
        'type': 'boolean'
    },

    'bdgg_convert_overrustle_links': {
        'name': 'Convert stream links to overrustle',
        'description': 'Auto-converts stream links to use overrustle.com',
        'value': false,
        'type': 'boolean'
    },

    'bdgg_flair_hide_all': {
        'name': 'Hide all flair',
        'description': 'Hide all Better Destiny.gg flair',
        'value': false,
        'type': 'boolean'
    },

    'bdgg_flair_country_display': {
        'name': 'Display my country flair',
        'description': "Display your destiny.gg/profile nationality flag to others as flair",
        'value': false,
        'type': 'boolean'
    },

    'bdgg_flair_all_country_display': {
        'name': "Show all country flairs",
        'description': "Show everyone's flag flairs",
        'value': true,
        'type': 'boolean'
    },

    'bdgg_filter_words': {
        'name': 'Custom ignore words',
        'description': 'Comma-separated list of words to filter messages from chat (case-insensitive)',
        'value': '',
        'type': 'string'
    }
};

var _observers = [];

var _notify = function(key, value) {
    for (var i = 0; i < _observers.length; i++) {
        _observers[i].call(this, key, value);
    }
};

let settings = {
    init: function() {
        $('#chat-tools-wrap').prepend(templates.menu_button());
        $('#chat-bottom-frame').append(
            $(templates.menu()).append(
                templates.menu_footer({version: version})));

        $('#bdgg-settings-btn').on('click', function(e) {
            $('#bdgg-settings').toggle();
            $(this).toggleClass('active');
            window.ChatMenu.closeMenus(destiny.chat.gui);
        });

        $('#bdgg-settings .close').on('click', (e) => {
            this.hide();
        });

        for (var key in SETTINGS) {
            var s = SETTINGS[key];
            s.key = key;
            s.value = this.get(s.key, s.value);
            this.add(s);
        }

        //TODO: bound function?
        destiny.chat.gui.ui.find('#chat-settings-btn, #chat-users-btn').on('click', () => this.hide());
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
        if (setting.type == 'string') {
            $('#bdgg-settings ul').append(templates.menu_text({setting: setting}));
            $('#bdgg-settings input[type="text"]#' + setting.key).on('blur', e => {
                var value = $(e.currentTarget).val();
                this.put(setting.key, value);
            });
        } else { // boolean
            $('#bdgg-settings ul').append(templates.menu_checkbox({setting: setting}));
            $('#bdgg-settings input[type="checkbox"]#' + setting.key).on('change', e => {
                var value = $(e.currentTarget).prop('checked');
                this.put(setting.key, value);
            });
        }
    },
    get: function(key, defValue) {
        var value = localStorage.getItem(key);
        if (value == null) {
            value = defValue;
            this.put(key, defValue);
        } else if (SETTINGS[key] && SETTINGS[key].type == 'boolean') {
            value = value === 'true';
        }

        return value;
    },
    put: function(key, value) {
        localStorage.setItem(key, value);
        _notify(key, value);
    }
};

export default settings
