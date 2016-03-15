;(function(bdgg) {
		console.log('ready');
		bdgg.zleft = (function() {
			var chat, stream
			return {
				init: function() {
					stream = window.parent.document.querySelector("div#stream-panel");
					chat = window.parent.document.querySelector("div#chat-panel");
					bdgg.zleft.leftBoys(bdgg.settings.get('bgg_left_chat'));
					bdgg.settings.addObserver(function(key, val) {
						if (key == 'bdgg_left_chat')
							console.log('changed')
						bdgg.zleft.leftBoys(val)
					})
				},
				leftBoys: function(val) {
					if (val) {
						stream.style.cssFloat = "right";
						chat.style.cssFloat = "left";
					} else {
						stream.style.cssFloat = "left";
						chat.style.cssFloat = "right";
					}
				}
			}
		})()
})(window.BetterDGG = window.BetterDGG || {})