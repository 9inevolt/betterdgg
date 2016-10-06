import * as templates from './templates';

let alert = {
    show: function(message) {
        this.hide();
        $('#destinychat').append(templates.alert({message: message}));
        $('#bdgg-alert').show();
    },
    hide: function() {
        $('#bdgg-alert').hide().remove();
    }
};

$('body').on('click', '#bdgg-alert .close', function() {
    alert.hide();
});

export default alert
