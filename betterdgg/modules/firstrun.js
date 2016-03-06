;(function(bdgg) {
    bdgg.firstrun = (function() {
        return {
            init: function() {
                var lastRun = bdgg.settings.get('bdgg_lastrun_version');
                if (bdgg.version != lastRun) {
                    $('body').append(bdgg.templates.popup({version: bdgg.version}));
                    var popup = $('#bdgg-popup');
                    popup.find('.bdgg-dismiss').on('click', function() {
                        bdgg.settings.put('bdgg_lastrun_version', bdgg.version);
                        popup.remove();
                    });
                    popup.show();
                }

                var chat = $('#destinychat');
                chat.append(bdgg.templates.about({version: bdgg.version}));

                $('body').on('click', '.bdgg-whatsnew', function() {
                    $('#bdgg-about').show();
                    bdgg.settings.hide();
                    bdgg.alert.hide();
                });

                $('#bdgg-about .close').on('click', function() {
                    $('#bdgg-about').hide();
                });
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
