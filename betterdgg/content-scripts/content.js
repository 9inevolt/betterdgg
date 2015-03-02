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
    } else if (e.data.type == 'bdgg_overrustle_get_strims') {
        var req = new XMLHttpRequest();
        req.onload = function() {
            var strims = parseStrims(this.responseText);
            window.postMessage({ type: 'bdgg_overrustle_strims', strims: strims.slice(0, e.data.count) }, '*');
        };
        req.open('GET', 'http://api.overrustle.com/api');
        req.send();
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
