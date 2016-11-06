import xhr from 'xhr';

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (!msg || !msg.xhr || !sendResponse) {
        return;
    }

    xhr(msg.xhr, (err, resp, body) => {
        if (!err && resp.statusCode == 200) {
            sendResponse(body);
        }
    });

    return true;
});
