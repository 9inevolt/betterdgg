function isWindow(src) {
    return src == window || typeof unsafeWindow != "undefined" && src.wrappedJSObject == unsafeWindow;
}

window.addEventListener("message", function(e) {
    if (!isWindow(e.source) || !e.data.type) {
        return;
    }

    if (e.data.type == 'bdgg_hello_world') {
        console.log("Content script received: " + e.data.text);
    } else if (e.data.type == 'bdgg_ustream_url') {
        var req = new XMLHttpRequest();
        req.onload = function() {
            if (match = /"cid":(\d+)/.exec(this.responseText)) {
                //console.log("ustream cid is " + match[1]);
                window.postMessage({ type: 'bdgg_ustream_channel', text: e.data.text, id: match[1] }, '*');
            }
        };
        req.open('GET', e.data.text);
        req.send();
    }
});
