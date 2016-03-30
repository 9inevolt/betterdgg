function isWindow(src) {
    return src === window
        || typeof unsafeWindow !== "undefined"
        && src.wrappedJSObject === unsafeWindow;
}

function doXHR(xhr) {
    if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage(null, { xhr: xhr }, xhr.onload);
    } else {
        var req = new XMLHttpRequest();
        req.onload = function() { xhr.onload(this.responseText); };
        req.open(xhr.method, xhr.url);
        req.send();
    }
}

window.addEventListener("message", function(e) {

    if (!isWindow(e.source) || !e.data.type) {
        return;
    }

    var xhr;

    if (e.data.type === 'bdgg_hello_world') {
        console.warn("Content script received: " + e.data.text);
    } else if (e.data.type === 'bdgg_ustream_url') {
        xhr = {
            onload: function(responseText) {
                var match;
                if (match = /cId=(\d+)/.exec(responseText)) {
                    //console.log("ustream cid is " + match[1]);
                    window.postMessage({ type: 'bdgg_ustream_channel', text: e.data.text, id: match[1] }, '*');
                }
            },
            method: 'GET',
            url: e.data.text
        };
        doXHR(xhr);
    } else if (e.data.type === 'bdgg_overrustle_get_strims') {
        xhr = {
            onload: function(responseText) {
                var strims = parseStrims(responseText);
                window.postMessage({ type: 'bdgg_overrustle_strims', strims: strims.slice(0, e.data.count) }, '*');
            },
            method: 'GET',
            url: 'http://api.overrustle.com/api'
        };
        doXHR(xhr);
    } else if (e.data.type === 'bdgg_get_profile_info') {
        xhr = {
            onload: function(responseText) {
                var info = JSON.parse(responseText);
                window.postMessage({ type: 'bdgg_profile_info', info: info }, '*');
            },
            method: 'GET',
            url: 'https://www.destiny.gg/profile/info'
        };
        doXHR(xhr);
    }
});

function parseStrims(responseText) {
    var resp = JSON.parse(responseText);
    if (resp == null || !resp.propertyIsEnumerable('streams')) {
        return;
    }

    var enrich = resp.propertyIsEnumerable('metadata') && resp.propertyIsEnumerable('metaindex');

    var strims = Object.keys(resp.streams).map(function(k) {
        return buildStrim(resp, k, enrich);
    }).sort(function(a, b) {
        // most to least or alphabetical
        if (a.viewers !== b.viewers) {
            return b.viewers - a.viewers;
        }

        return a.url.localeCompare(b.url);
    });

    return strims;
}

var enrichProps = [ "name", "channel", "platform", "live", "title", "image_url", "expire_at" ];
function buildStrim(resp, k, enrich) {
    var strim = { "url": k, "viewers": resp.streams[k] };

    if (enrich) {
        var mdk = resp.metaindex[k];
        var md = resp.metadata[mdk];
        if (md != null) {
            enrichProps.map(function(p) {
                strim[p] = md[p];
            });
        }
    }

    return strim;
}
