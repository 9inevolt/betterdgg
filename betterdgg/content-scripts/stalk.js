var port = null;

if (typeof chrome !== "undefined" && chrome.runtime) {
    port = chrome.runtime.connect();
    port.onMessage.addListener(pushMessage);
} else if (typeof self !== "undefined" && self.postMessage) {
    self.on("message", pushMessage);
}

window.addEventListener("message", function(e) {
    if (!isWindow(e.source) || !e.data.type) {
        return;
    }

    if (e.data.type === 'bdgg_stalk_request') {
        // Copy data for firefox to work
        portMessage({ data: e.data });
    } else if (e.data.type === 'bdgg_flair_update') {
        //console.log("Flair update received: " + e.data);
        portMessage({ data: e.data });
    } else if (e.data.type === 'bdgg_users_refresh') {
        //console.log("Refresh users");
        portMessage({ data: e.data });
    }
});

function pushMessage(obj)
{
    window.postMessage(obj, '*');
}

function portMessage(obj)
{
    if (typeof chrome !== "undefined" && chrome.runtime) {
        port.postMessage(obj);
    } else if (typeof self !== "undefined" && self.postMessage) {
        self.postMessage(obj);
    }
}
