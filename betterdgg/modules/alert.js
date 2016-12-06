import * as templates from './templates';

let alert = {
    init: function() {
        $('body').on('click', '#bdgg-alert .close', function() {
            alert.hide();
        });
    },
    show: function(message) {
        this.hide();
        $('#destinychat').append(templates.alert({message: message}));
        $('#bdgg-alert').show();
    },
    hide: function() {
        $('#bdgg-alert').hide().remove();
    }
};

export default alert;
