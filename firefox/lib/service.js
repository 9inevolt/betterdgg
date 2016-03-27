const data = require("sdk/self").data;
const pageMod = require("sdk/page-mod");
const pageWorker = require("sdk/page-worker");
const { setTimeout } = require("sdk/timers");

// Attach to chat page and relay all messages
var workerAttached = function(worker) {
    // Create background page worker to use websockets
    var wspage = pageWorker.Page({
        contentScriptFile: [ data.url("jsbn.js"), data.url("wampy.js"), data.url("wshelper.js") ],
        contentURL: data.url("websocket.html")
    });
    wspage.on('error', function(e) { console.error(e); });

    setTimeout(function() {
        worker.on('message', function(e) {
            wspage.postMessage(e);
        });
        wspage.on('message', function(e) {
            worker.postMessage(e);
        });
        wspage.port.emit('attach');
    }, 500);

    worker.on('detach', function() { wspage.destroy(); });
};

var mod = pageMod.PageMod({
    include: /.*destiny\.gg\/embed\/chat.*/,
    contentScriptFile: data.url("betterdgg.js"),
    contentStyleFile: [ data.url("betterdgg.css") ],
    attachTo: [ "top", "frame" ],
    onAttach: workerAttached
});

exports.pagemod = mod;
exports.workerAttached = workerAttached;
