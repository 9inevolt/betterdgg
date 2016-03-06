;(function(bdgg) {
    bdgg.alert = (function() {
        $('body').on('click', '#bdgg-alert .close', function() {
            bdgg.alert.hide();
        });

        return {
            show: function(message) {
                bdgg.alert.hide();
                $('#destinychat').append(bdgg.templates.alert({message: message}));
                $('#bdgg-alert').show();
            },
            hide: function() {
                $('#bdgg-alert').hide().remove();
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
