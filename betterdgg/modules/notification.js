;(function(bdgg) {
	bdgg.notification = (function() {
		return {
			init: function() {
				var isChrome
				isChrome = !!window.chrome && !!window.chrome.webstore
				var fnChatPRIVMSG = destiny.chat.onPRIVMSG
				var bdggChatPRIVMSG = function(data) {
					var bdggPRIVMSG = fnChatPRIVMSG.apply(this, arguments);
					var notif
					var isChrome = !!window.chrome && !!window.chrome.webstore
					if (bdgg.settings.get('bdgg_Private_Message_Notifications')) {
						if (Notification.permission === 'granted' && isChrome){
							var memes = {
								body: data.nick + " sent you a private message, Click me to view the chat!",
								icon: destiny.cdn + '/chat/img/notifyicon.png'
							}
							notif = new Notification("Better Better Destiny.GG", memes)
							notif.onclick = function(x) { window.focus(); notif.close(); };
							setTimeout(function(){ notif.close(); }, 5000)
						} else if (Notification.permission === 'granted' && !isChrome){
							var memes = {
								body: data.nick + " sent you a private message, Click me to view the chat!",
								icon: destiny.cdn + '/chat/img/notifyicon.png'
							}
							notif = new Notification("Better Better Destiny.GG", memes)
							setTimeout(function(){ notif.close(); }, 5000)
						}
					}
					return bdggPRIVMSG;
				}
				destiny.chat.onPRIVMSG = bdggChatPRIVMSG;
			}
		}
	})()
}(window.BetterDGG = window.BetterDGG || {}))
