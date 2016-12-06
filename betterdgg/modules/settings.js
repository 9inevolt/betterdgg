import EventEmitter from 'events';
import SETTINGS from '../settings.json';
import * as templates from './templates';
import version from './version';

const emitter = new EventEmitter();

let settings = {
    init: function() {
        $('#chat-tools-wrap').prepend(templates.menu_button())
            .insertBefore('#chat-input-wrap');
        $('#chat-bottom-frame').append(
            $(templates.menu()).append(
                templates.menu_footer({version: version})))
            .append(templates.advanced());

        $('#bdgg-settings-btn').on('click', function(e) {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $('#bdgg-settings').show();
                $('#bdgg-settings .nano').nanoScroller();
            } else {
                settings.hide();
            }
            window.ChatMenu.closeMenus(destiny.chat.gui);
        });

        $('#bdgg-settings').on('click', '.bdgg-advanced', function() {
            $('#bdgg-advanced').show();
        });

        $('#bdgg-advanced .close').on('click', function() {
            $('#bdgg-advanced').hide();
        });

        $('#bdgg-settings .close').on('click', this.hide.bind(this));
        destiny.chat.gui.input.on('keydown mousedown', this.hide.bind(this));
        destiny.chat.gui.output.on('mousedown', this.hide.bind(this));

        for (var key in SETTINGS) {
            var s = SETTINGS[key];
            s.key = key;
            s.value = this.get(s.key, s.value);
            this.add(s);
        }

        destiny.chat.gui.ui.find('#chat-settings-btn, #chat-users-btn, #emoticon-btn').on(
            'click', this.hide.bind(this));
    },
    on(eventName, listener) {
        emitter.on(eventName, listener);
        return this;
    },
    removeListener(eventName, listener) {
        emitter.removeListener(eventName, listener);
        return this;
    },
    hide: function() {
        $('#bdgg-settings').hide();
        $('#bdgg-advanced').hide();
        $('#bdgg-settings-btn').removeClass('active');
    },
    add: function(setting) {
        if (setting.type === 'string') {
            $('#bdgg-advanced ul').append(templates.advanced_text({setting: setting}));
            $('#bdgg-advanced input[type="text"]#' + setting.key).on('blur', e => {
                var value = $(e.currentTarget).val();
                this.put(setting.key, value);
            });
        } else if (setting.type === 'select') {
            $('#bdgg-advanced ul').append(templates.advanced_select({setting: setting}));
            $('#bdgg-advanced select#' + setting.key).on('change', e => {
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
        } else if (SETTINGS[key] && SETTINGS[key].type === 'boolean') {
            value = value === 'true';
        }

        return value;
    },
    put: function(key, value) {
        localStorage.setItem(key, value);
        emitter.emit(key, value);
    }
};

export default settings;
