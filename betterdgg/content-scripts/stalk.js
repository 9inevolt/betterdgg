var port = null;

if (typeof chrome != "undefined" && chrome.runtime) {
    port = chrome.runtime.connect();
    port.onMessage.addListener(pushMessage);
}

window.addEventListener("message", function(e) {
    if (!isWindow(e.source) || !e.data.type) {
        return;
    }

    if (e.data.type == 'bdgg_stalk_request') {
        port.postMessage(e);
        // Might still need this for firefox
        /*var query = {
            QueryType: e.data.query.QueryType,
            Name: e.data.query["Name"],
            Names: e.data.query["Names"],
            Number: e.data.query["Number"],
            Session: e.data.query["Session"]
        };*/
    } else if (e.data.type == 'bdgg_flair_update') {
        //console.log("Flair update received: " + e.data);
        port.postMessage(e);
    } else if (e.data.type == 'bdgg_users_refresh') {
        //console.log("Refresh users");
        port.postMessage(e);
    }
});

function pushMessage(obj)
{
    window.postMessage(obj, '*');
}
