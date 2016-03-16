;(function(bdgg) {
    bdgg.ignore = (function() {
    	var style, cssBody, template
    	cssBody = '{display:none;}'
    	template = '.user-msg[data-username="{}"]'
        return {
        	init: function() {
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
        }
    })()
}(window.BetterDGG = window.BetterDGG || {}))