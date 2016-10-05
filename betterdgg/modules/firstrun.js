import alert from './alert';
import settings from './settings';
import templates from './templates';
import version from './version';

let firstrun = {
    init: function() {
        var lastRun = settings.get('bdgg_lastrun_version');
        if (version != lastRun) {
            $('body').append(templates.popup({version: version}));
            var popup = $('#bdgg-popup');
            popup.find('.bdgg-dismiss').on('click', function() {
                settings.put('bdgg_lastrun_version', version);
                popup.remove();
            });
            popup.show();
        }

        var chat = $('#destinychat');
        chat.append(templates.about({version: version}));

        $('body').on('click', '.bdgg-whatsnew', function() {
            $('#bdgg-about').show();
            settings.hide();
            alert.hide();
        });

        $('#bdgg-about .close').on('click', function() {
            $('#bdgg-about').hide();
        });
    }
};

export default firstrun
