chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (!msg || !msg.xhr || !sendResponse) {
        return;
    }

    var xhr = msg.xhr;
    var req = new XMLHttpRequest();
    req.onload = function() { sendResponse(this.responseText) };
    req.open(xhr.method, xhr.url);
    req.send();
    return true;
});
