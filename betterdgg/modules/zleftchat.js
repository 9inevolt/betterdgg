;(function(bdgg) {
	//Chat is not resizeable while on the left but can be moved back to the right, resized and moved back
	//Wait for document to load even though querySelector only returns a value once the page is loaded according to some guy on the internet
	//$(document).ready(function() {
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
					if (val == true) {
						stream.style.cssFloat = "right";
						chat.style.cssFloat = "left";
					} else {
						stream.style.cssFloat = "left";
						chat.style.cssFloat = "right";
					}
				}
			}
		})()
//})
})(window.BetterDGG = window.BetterDGG || {})