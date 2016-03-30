(function(bdgg) {
    bdgg.theme = (function() {
        return {
            init: function() {
                bdgg.theme.setLightTheme(bdgg.settings.get('bdgg_light_theme'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key === 'bdgg_light_theme') {
                        bdgg.theme.setLightTheme(value);
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
    })();
}(window.BetterDGG = window.BetterDGG || {}));
