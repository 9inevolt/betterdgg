import { handleMessage, sendMessage } from '../messaging';

function doXHR(xhr) {
    return sendMessage('bdgg_xhr', xhr);
}

handleMessage('bdgg_ustream_url', msg => {
    let xhr = {
        method: 'GET',
        url: msg.text
    };

    return doXHR(xhr).then(responseText => {
        var match = /cId=(\d+)/.exec(responseText);
        if (match) {
            //console.log("ustream cid is " + match[1]);
            return {id: match[1]};
        }
    });
});

handleMessage('bdgg_overrustle_get_strims', msg => {
    let xhr = {
        method: 'GET',
        url: 'http://api.overrustle.com/api',
        responseType: 'json'
    };

    return doXHR(xhr).then(response => {
        let strims = sortStrims(response).slice(0, msg.count);
        return {strims};
    });
});

handleMessage('bdgg_get_profile_info', () => {
    let xhr = {
        method: 'GET',
        url: 'https://www.destiny.gg/profile/info',
        responseType: 'json'
    };

    return doXHR(xhr);
});

handleMessage('bdgg_phrase_request', () => {
    let xhr = {
        method: 'GET',
        url: 'http://downthecrop.xyz/bbdgg/api/phrases.json',
        responseType: 'json'
    };

    return doXHR(xhr);
});

handleMessage('bdgg_flair_request', () => {
    let xhr = {
        method: 'GET',
        url: 'http://downthecrop.xyz/bbdgg/api/flairs.json',
        responseType: 'json'
    };

    return doXHR(xhr);
});

handleMessage('bdgg_get_url', chrome.runtime.getURL);

handleMessage('bdgg_get_linkinfo', url => {
    let encodedURL = encodeURIComponent(url);
    let xhr = {
        method: 'GET',
        url: 'https://api.betterttv.net/2/link_resolver/' + encodedURL,
        responseType: 'json'
    };

    return doXHR(xhr);
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
