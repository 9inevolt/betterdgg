;(function (bdgg) {
	//if bdgg.settings.get('bdgg_stalk_targets') != '' {
	// I even tried to see if something like this would fix it
	// Litteraly 99% your code BTW NoTears
    var CSS = {
        init: function () {
            var userlist = CSS.buildUserList(),
                cssBody = '{background-color:rgba(18,144,117,0.25);color:rgb(242, 242, 242);}'
             head = document.head || document.getElementsByTagName('head') [0],
                style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = userlist + cssBody;
            } else {
                style.appendChild(document.createTextNode(userlist + cssBody));
            }
            head.appendChild(style);
        },
        buildUserList: function () {
			//var memes = bdgg.settings.get('bdgg_stalk_targets');
			
			var memes = 'Sweetie_belle,Saraghz,diathorn,biogilas,axik_,downthecrop';
			memes = memes.replace(/\s+/g, '');
			memes = memes.toLowerCase();
            var users = memes.split(','),
                template = '.user-msg[data-username="{}"]',
                result = '';
            for (var i = 0; i < users.length; i++) {
                result += template.replace('{}', users[i]) + ',';
            }
            result = result.substring(0, result.length - 1);
            return result;
        }
    };
    CSS.init();
	//}
}(window.BetterDGG = window.BetterDGG || {}));