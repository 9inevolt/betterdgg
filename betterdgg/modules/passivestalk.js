;(function(bdgg) {
    bdgg.passivestalk = (function() {
    	var style, cssBody, template
    	cssBody = '{background-color:rgba(18,144,117,0.25);color:rgba(255,255,255,0.8);}'
    	template = '.user-msg[data-username="{}"]'
        return {
        	init: function() {
        		style = document.createElement('style')
        		style.type = 'text/css'
        		document.head.appendChild(style)
        		bdgg.settings.addObserver(function(key, val) {
        			if (key == 'bgg_passive_stalk')
        				bdgg.passivestalk.update(val)
        		})
        		bdgg.passivestalk.update(bdgg.settings.get('bgg_passive_stalk'))
        	},
        	update: function(userList) {
        		var res = ''
        		userList = userList.toLowerCase().split(' ').join('').split(',')
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
