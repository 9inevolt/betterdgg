import settings from './settings';

let theme = {
    init: function() {
        this.setLightTheme(settings.get('bdgg_light_theme'));
        settings.addObserver((key, value) => {
            if (key == 'bdgg_light_theme') {
                this.setLightTheme(value);
            }
        });
    },
    setLightTheme: function(value) {
        if (value) {
            $('.chat').removeClass('chat-theme-dark').addClass('chat-theme-light');
        } else {
            $('.chat').removeClass('chat-theme-light').addClass('chat-theme-dark');
        }
    }
};

export default theme
