;(function(bdgg) {
	bdgg.ignore = (function() {
		var style, cssBody, template
		cssBody = '{display:none;}'
		template = '.user-msg[data-username="{}"]'
		return {
			init: function() {
				//bdgg.ignore.chatLines();
				style = document.createElement('style')
				style.type = 'text/css'
				document.head.appendChild(style)
				bdgg.settings.addObserver(function(key, val) {
					if (key == 'bdgg_user_ignore')
						bdgg.ignore.update(val)
				})
				bdgg.ignore.update(bdgg.settings.get('bdgg_user_ignore'))
			},
			update: function(userList) {
				var res = ''
				if (userList.length != 0) { 
					userList = userList.toLowerCase().split(' ').join('').split(',')
				}
				for (var i = 0; i < userList.length;i++)
					res += template.replace('{}', userList[i]) + ','
				res = res.substring(0, res.length - 1)
				if (style.styleSheet)
					style.styleSheet.cssText = res + cssBody
				else {
					style.innerHTML = ''
					style.appendChild(document.createTextNode(res + cssBody))
				}
			}
			/**
			chatLines: function() {
				var chatSetting = bdgg.settings.get('chatoptions');
				var finalSet = chatSetting.substr(chatSetting.length - 4);
				finalSet = finalSet.substr(0, finalSet.length - 1);
				if (parseInt(finalSet) < 300) {
					chatSetting = chatSetting.substr(0, chatSetting.length - 4);
					chatSetting = chatSetting + '600}'
					bdgg.settings.put('chatoptions', chatSetting);
				}
			}
			*/
		}
	})()
}(window.BetterDGG = window.BetterDGG || {}))