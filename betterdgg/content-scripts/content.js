function isWindow(src) {
    return src == window || typeof unsafeWindow != "undefined" && src.wrappedJSObject == unsafeWindow;
}

function doXHR(xhr, sendResponse) {
    chrome.runtime.sendMessage({ xhr }, sendResponse);
}

window.addEventListener("message", function(e) {
    if (!isWindow(e.source) || !e.data.type) {
        return;
    }

    if (e.data.type == 'bdgg_hello_world') {
        console.log("Content script received: " + e.data.text);
    } else if (e.data.type == 'bdgg_ustream_url') {
        var xhr = {
            method: 'GET',
            url: e.data.text
        };
        let sendResponse = responseText => {
            var match = /cId=(\d+)/.exec(responseText);
            if (match) {
                //console.log("ustream cid is " + match[1]);
                window.postMessage({ type: 'bdgg_ustream_channel', text: e.data.text, id: match[1] }, '*');
            }
        };
        doXHR(xhr, sendResponse);
    } else if (e.data.type == 'bdgg_overrustle_get_strims') {
        let xhr = {
            method: 'GET',
            url: 'http://api.overrustle.com/api',
            responseType: 'json'
        };
        doXHR(xhr, response => {
            var strims = sortStrims(response);
            window.postMessage({ type: 'bdgg_overrustle_strims', strims: strims.slice(0, e.data.count) }, '*');
        });
    } else if (e.data.type == 'bdgg_get_profile_info') {
        let xhr = {
            method: 'GET',
            url: 'https://www.destiny.gg/profile/info',
            responseType: 'json'
        };
        doXHR(xhr, info => {
            window.postMessage({ type: 'bdgg_profile_info', info: info }, '*');
        });
    } else if (e.data.type === 'bdgg_phrase_request') {
        let xhr = {
            method: 'GET',
            url: 'http://downthecrop.xyz/bbdgg/api/phrases.json',
            responseType: 'json'
        };
        doXHR(xhr, phrase => {
            window.postMessage({ type: 'bdgg_phrase_reply', response: phrase }, '*');
        });
    } else if (e.data.type === 'bdgg_flair_request') {
        let xhr = {
            method: 'GET',
            url: 'http://downthecrop.xyz/bbdgg/api/flairs.json',
            responseType: 'json'
        };
        doXHR(xhr, flairs => {
            window.postMessage({ type: 'bdgg_flair_reply', response: flairs }, '*');
        });
    } else if (e.data.type === 'bdgg_get_url') {
        let url = chrome.runtime.getURL(e.data.path);
        window.postMessage({ type: 'bdgg_url', path: e.data.path, url: url }, '*');
    } else if (e.data.type === 'bdgg_get_linkinfo') {
        let encodedURL = encodeURIComponent(e.data.url);
        let xhr = {
            method: 'GET',
            url: 'https://api.betterttv.net/2/link_resolver/' + encodedURL,
            responseType: 'json'
        };
        doXHR(xhr, data => {
            window.postMessage({ type: 'bdgg_linkinfo', url: e.data.url, data }, '*');
        });
    }
});

function sortStrims(responseText) {
    var resp = responseText;
    if (resp == null || !resp.propertyIsEnumerable('streams')) {
        return;
    }

    var enrich = resp.propertyIsEnumerable('metadata') && resp.propertyIsEnumerable('metaindex');

    var strims = Object.keys(resp.streams).map(function(k) {
        return buildStrim(resp, k, enrich);
    }).sort(function(a, b) {
        // most to least or alphabetical
        if (a.viewers != b.viewers) {
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

export { isWindow };
