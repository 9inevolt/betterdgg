import settings from './settings';

//TODO: avoid inline styles
var style, cssBody, template;
cssBody = '{display:none;}';
template = '.user-msg[data-username="{}"]';

let ignore = {
    init: function() {
        this.chatLines();
        style = document.createElement('style');
        style.type = 'text/css';
        document.head.appendChild(style);
        settings.on('bdgg_user_ignore', value => { this.update(value) });
        this.update(settings.get('bdgg_user_ignore'));
    },
    update: function(userList) {
        var res = '';
        if (userList.length) {
            userList = userList.toLowerCase().split(' ').join('').split(',');
        }
        for (var i = 0; i < userList.length; i++)
            res += template.replace('{}', userList[i]) + ',';
        res = res.substring(0, res.length - 1);
        if (style.styleSheet) {
            style.styleSheet.cssText = res + cssBody;
        }
        else {
            style.innerHTML = '';
            style.appendChild(document.createTextNode(res + cssBody));
        }
    },

    chatLines: function() {

        var chatoptions = localStorage.getItem('chatoptions');
        if (chatoptions === null){
            /**
             * If the user never changed any destiny.gg settings, the options are null.
             * Work around this by setting it to an empty JSON string which we can operate on.
             */
            chatoptions = "{}";
        }

        var setting = JSON.parse(chatoptions);
        if (setting.maxlines) {
            if (setting.maxlines < 200) {
                setting.maxlines = 600;
                setting = JSON.stringify(setting);
                localStorage.setItem('chatoptions', setting);
            }
        }
        else {
            setting.maxlines = 600;
            setting = JSON.stringify(setting);
            localStorage.setItem('chatoptions', setting);
        }
    }
};

export default ignore
