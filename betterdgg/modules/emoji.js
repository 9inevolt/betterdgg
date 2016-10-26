import emojione from 'emojione';
import twemoji from 'twemoji';
import settings from './settings';

const PATH = 'images/';

let missingEscapes = {"\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69":"1f469-2764-1f48b-1f469","\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68":"1f468-2764-1f48b-1f468","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66\u200D\uD83D\uDC66":"1f468-1f468-1f466-1f466","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66":"1f468-1f468-1f467-1f466","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC67":"1f468-1f468-1f467-1f467","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66":"1f468-1f469-1f466-1f466","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66":"1f468-1f469-1f467-1f466","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67":"1f468-1f469-1f467-1f467","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66":"1f469-1f469-1f466-1f466","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66":"1f469-1f469-1f467-1f466","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67":"1f469-1f469-1f467-1f467","\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC69":"1f469-2764-1f469","\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC68":"1f468-2764-1f468","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66":"1f468-1f468-1f466","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67":"1f468-1f468-1f467","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67":"1f468-1f469-1f467","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66":"1f469-1f469-1f466","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67":"1f469-1f469-1f467","\uD83D\uDC41\u200D\uD83D\uDDE8":"1f441-1f5e8","\u0023\uFE0F\u20E3":"0023-20e3","\u0030\uFE0F\u20E3":"0030-20e3","\u0031\uFE0F\u20E3":"0031-20e3","\u0032\uFE0F\u20E3":"0032-20e3","\u0033\uFE0F\u20E3":"0033-20e3","\u0034\uFE0F\u20E3":"0034-20e3","\u0035\uFE0F\u20E3":"0035-20e3","\u0036\uFE0F\u20E3":"0036-20e3","\u0037\uFE0F\u20E3":"0037-20e3","\u0038\uFE0F\u20E3":"0038-20e3","\u0039\uFE0F\u20E3":"0039-20e3","\u002A\uFE0F\u20E3":"002a-20e3","\uD83C\uDC04\uFE0F":"1f004","\uD83C\uDD7F\uFE0F":"1f17f","\uD83C\uDE02\uFE0F":"1f202","\uD83C\uDE1A\uFE0F":"1f21a","\uD83C\uDE2F\uFE0F":"1f22f","\uD83C\uDE37\uFE0F":"1f237","\uD83C\uDF9E\uFE0F":"1f39e","\uD83C\uDF9F\uFE0F":"1f39f","\uD83C\uDFCB\uFE0F":"1f3cb","\uD83C\uDFCC\uFE0F":"1f3cc","\uD83C\uDFCD\uFE0F":"1f3cd","\uD83C\uDFCE\uFE0F":"1f3ce","\uD83C\uDF96\uFE0F":"1f396","\uD83C\uDF97\uFE0F":"1f397","\uD83C\uDF36\uFE0F":"1f336","\uD83C\uDF27\uFE0F":"1f327","\uD83C\uDF28\uFE0F":"1f328","\uD83C\uDF29\uFE0F":"1f329","\uD83C\uDF2A\uFE0F":"1f32a","\uD83C\uDF2B\uFE0F":"1f32b","\uD83C\uDF2C\uFE0F":"1f32c","\uD83D\uDC3F\uFE0F":"1f43f","\uD83D\uDD77\uFE0F":"1f577","\uD83D\uDD78\uFE0F":"1f578","\uD83C\uDF21\uFE0F":"1f321","\uD83C\uDF99\uFE0F":"1f399","\uD83C\uDF9A\uFE0F":"1f39a","\uD83C\uDF9B\uFE0F":"1f39b","\uD83C\uDFF3\uFE0F":"1f3f3","\uD83C\uDFF5\uFE0F":"1f3f5","\uD83C\uDFF7\uFE0F":"1f3f7","\uD83D\uDCFD\uFE0F":"1f4fd","\uD83D\uDD49\uFE0F":"1f549","\uD83D\uDD4A\uFE0F":"1f54a","\uD83D\uDD6F\uFE0F":"1f56f","\uD83D\uDD70\uFE0F":"1f570","\uD83D\uDD73\uFE0F":"1f573","\uD83D\uDD76\uFE0F":"1f576","\uD83D\uDD79\uFE0F":"1f579","\uD83D\uDD87\uFE0F":"1f587","\uD83D\uDD8A\uFE0F":"1f58a","\uD83D\uDD8B\uFE0F":"1f58b","\uD83D\uDD8C\uFE0F":"1f58c","\uD83D\uDD8D\uFE0F":"1f58d","\uD83D\uDDA5\uFE0F":"1f5a5","\uD83D\uDDA8\uFE0F":"1f5a8","\uD83D\uDDB2\uFE0F":"1f5b2","\uD83D\uDDBC\uFE0F":"1f5bc","\uD83D\uDDC2\uFE0F":"1f5c2","\uD83D\uDDC3\uFE0F":"1f5c3","\uD83D\uDDC4\uFE0F":"1f5c4","\uD83D\uDDD1\uFE0F":"1f5d1","\uD83D\uDDD2\uFE0F":"1f5d2","\uD83D\uDDD3\uFE0F":"1f5d3","\uD83D\uDDDC\uFE0F":"1f5dc","\uD83D\uDDDD\uFE0F":"1f5dd","\uD83D\uDDDE\uFE0F":"1f5de","\uD83D\uDDE1\uFE0F":"1f5e1","\uD83D\uDDE3\uFE0F":"1f5e3","\uD83D\uDDE8\uFE0F":"1f5e8","\uD83D\uDDEF\uFE0F":"1f5ef","\uD83D\uDDF3\uFE0F":"1f5f3","\uD83D\uDDFA\uFE0F":"1f5fa","\uD83D\uDEE0\uFE0F":"1f6e0","\uD83D\uDEE1\uFE0F":"1f6e1","\uD83D\uDEE2\uFE0F":"1f6e2","\uD83D\uDEF0\uFE0F":"1f6f0","\uD83C\uDF7D\uFE0F":"1f37d","\uD83D\uDC41\uFE0F":"1f441","\uD83D\uDD74\uFE0F":"1f574","\uD83D\uDD75\uFE0F":"1f575","\uD83D\uDD90\uFE0F":"1f590","\uD83C\uDFD4\uFE0F":"1f3d4","\uD83C\uDFD5\uFE0F":"1f3d5","\uD83C\uDFD6\uFE0F":"1f3d6","\uD83C\uDFD7\uFE0F":"1f3d7","\uD83C\uDFD8\uFE0F":"1f3d8","\uD83C\uDFD9\uFE0F":"1f3d9","\uD83C\uDFDA\uFE0F":"1f3da","\uD83C\uDFDB\uFE0F":"1f3db","\uD83C\uDFDC\uFE0F":"1f3dc","\uD83C\uDFDD\uFE0F":"1f3dd","\uD83C\uDFDE\uFE0F":"1f3de","\uD83C\uDFDF\uFE0F":"1f3df","\uD83D\uDECB\uFE0F":"1f6cb","\uD83D\uDECD\uFE0F":"1f6cd","\uD83D\uDECE\uFE0F":"1f6ce","\uD83D\uDECF\uFE0F":"1f6cf","\uD83D\uDEE3\uFE0F":"1f6e3","\uD83D\uDEE4\uFE0F":"1f6e4","\uD83D\uDEE5\uFE0F":"1f6e5","\uD83D\uDEE9\uFE0F":"1f6e9","\uD83D\uDEF3\uFE0F":"1f6f3","\uD83C\uDF24\uFE0F":"1f324","\uD83C\uDF25\uFE0F":"1f325","\uD83C\uDF26\uFE0F":"1f326","\uD83D\uDDB1\uFE0F":"1f5b1","\u00A9\uFE0F":"00a9","\u00AE\uFE0F":"00ae","\u203C\uFE0F":"203c","\u2049\uFE0F":"2049","\u2122\uFE0F":"2122","\u2139\uFE0F":"2139","\u2194\uFE0F":"2194","\u2195\uFE0F":"2195","\u2196\uFE0F":"2196","\u2197\uFE0F":"2197","\u2198\uFE0F":"2198","\u2199\uFE0F":"2199","\u21A9\uFE0F":"21a9","\u21AA\uFE0F":"21aa","\u231A\uFE0F":"231a","\u231B\uFE0F":"231b","\u24C2\uFE0F":"24c2","\u25AA\uFE0F":"25aa","\u25AB\uFE0F":"25ab","\u25B6\uFE0F":"25b6","\u25C0\uFE0F":"25c0","\u25FB\uFE0F":"25fb","\u25FC\uFE0F":"25fc","\u25FD\uFE0F":"25fd","\u25FE\uFE0F":"25fe","\u2600\uFE0F":"2600","\u2601\uFE0F":"2601","\u260E\uFE0F":"260e","\u2611\uFE0F":"2611","\u2614\uFE0F":"2614","\u2615\uFE0F":"2615","\u261D\uFE0F":"261d","\u263A\uFE0F":"263a","\u2648\uFE0F":"2648","\u2649\uFE0F":"2649","\u264A\uFE0F":"264a","\u264B\uFE0F":"264b","\u264C\uFE0F":"264c","\u264D\uFE0F":"264d","\u264E\uFE0F":"264e","\u264F\uFE0F":"264f","\u2650\uFE0F":"2650","\u2651\uFE0F":"2651","\u2652\uFE0F":"2652","\u2653\uFE0F":"2653","\u2660\uFE0F":"2660","\u2663\uFE0F":"2663","\u2665\uFE0F":"2665","\u2666\uFE0F":"2666","\u2668\uFE0F":"2668","\u267B\uFE0F":"267b","\u267F\uFE0F":"267f","\u2693\uFE0F":"2693","\u26A0\uFE0F":"26a0","\u26A1\uFE0F":"26a1","\u26AA\uFE0F":"26aa","\u26AB\uFE0F":"26ab","\u26BD\uFE0F":"26bd","\u26BE\uFE0F":"26be","\u26C4\uFE0F":"26c4","\u26C5\uFE0F":"26c5","\u26D4\uFE0F":"26d4","\u26EA\uFE0F":"26ea","\u26F2\uFE0F":"26f2","\u26F3\uFE0F":"26f3","\u26F5\uFE0F":"26f5","\u26FA\uFE0F":"26fa","\u26FD\uFE0F":"26fd","\u2702\uFE0F":"2702","\u2708\uFE0F":"2708","\u2709\uFE0F":"2709","\u270C\uFE0F":"270c","\u270F\uFE0F":"270f","\u2712\uFE0F":"2712","\u2714\uFE0F":"2714","\u2716\uFE0F":"2716","\u2733\uFE0F":"2733","\u2734\uFE0F":"2734","\u2744\uFE0F":"2744","\u2747\uFE0F":"2747","\u2757\uFE0F":"2757","\u2764\uFE0F":"2764","\u27A1\uFE0F":"27a1","\u2934\uFE0F":"2934","\u2935\uFE0F":"2935","\u2B05\uFE0F":"2b05","\u2B06\uFE0F":"2b06","\u2B07\uFE0F":"2b07","\u2B1B\uFE0F":"2b1b","\u2B1C\uFE0F":"2b1c","\u2B50\uFE0F":"2b50","\u2B55\uFE0F":"2b55","\u3030\uFE0F":"3030","\u303D\uFE0F":"303d","\u3297\uFE0F":"3297","\u3299\uFE0F":"3299","\u271D\uFE0F":"271d","\u2328\uFE0F":"2328","\u270D\uFE0F":"270d","\u23CF\uFE0F":"23cf","\u23ED\uFE0F":"23ed","\u23EE\uFE0F":"23ee","\u23EF\uFE0F":"23ef","\u23F1\uFE0F":"23f1","\u23F2\uFE0F":"23f2","\u23F8\uFE0F":"23f8","\u23F9\uFE0F":"23f9","\u23FA\uFE0F":"23fa","\u2602\uFE0F":"2602","\u2603\uFE0F":"2603","\u2604\uFE0F":"2604","\u2618\uFE0F":"2618","\u2620\uFE0F":"2620","\u2622\uFE0F":"2622","\u2623\uFE0F":"2623","\u2626\uFE0F":"2626","\u262A\uFE0F":"262a","\u262E\uFE0F":"262e","\u262F\uFE0F":"262f","\u2638\uFE0F":"2638","\u2639\uFE0F":"2639","\u2692\uFE0F":"2692","\u2694\uFE0F":"2694","\u2696\uFE0F":"2696","\u2697\uFE0F":"2697","\u2699\uFE0F":"2699","\u269B\uFE0F":"269b","\u269C\uFE0F":"269c","\u26B0\uFE0F":"26b0","\u26B1\uFE0F":"26b1","\u26C8\uFE0F":"26c8","\u26CF\uFE0F":"26cf","\u26D1\uFE0F":"26d1","\u26D3\uFE0F":"26d3","\u26E9\uFE0F":"26e9","\u26F0\uFE0F":"26f0","\u26F1\uFE0F":"26f1","\u26F4\uFE0F":"26f4","\u26F7\uFE0F":"26f7","\u26F8\uFE0F":"26f8","\u26F9\uFE0F":"26f9","\u2721\uFE0F":"2721","\u2763\uFE0F":"2763"}

// fix missing mappings in emojione
// https://github.com/Ranks/emojione/issues/320
Object.assign(emojione.jsEscapeMap, missingEscapes);

let tw_options = {
    folder: 'emoji',
    ext: '.svg',
    className: 'bdgg-emoji',
    callback: function(icon, options) {
        switch (icon) {
            case 'a9': // ©
            case 'ae': // ®
            case '2122': // ™
                return false;
        }
        return ''.concat(options.base, options.size, '/', icon, options.ext);
    }
};

function listener(e) {
    if (window != e.source) {
        return;
    }

    if (e.data.type === 'bdgg_url') {
        if (e.data.path === PATH) {
            tw_options.base = e.data.url;
            emojione.imagePathSVG = e.data.url + 'emojione/';
            emojione.imageType = 'svg';
            window.removeEventListener('message', listener);
        }
    }
}

function replaceEmojiCodes(message) {
    return message.split(' ').map(str => {
        if (!str.startsWith(':') || !str.endsWith(':')) {
            return str;
        }

        return emojione.shortnameToUnicode(str);
    }).join(' ');
}

let _theme = 'disabled';

let emoji = {
    init: function() {
        window.addEventListener('message', listener);
        window.postMessage({type: 'bdgg_get_url', path: PATH}, '*');
        this.theme(settings.get('bdgg_emoji_theme'));
        settings.addObserver((key, value) => {
            if (key == 'bdgg_emoji_theme') {
                this.theme(value);
            }
        });

        for (let e of Object.keys(emojione.emojioneList)) {
            destiny.chat.gui.autoCompletePlugin.addEmote(e);
        }

        let fnSend = destiny.chat.gui.send;
        destiny.chat.gui.send = function() {
            if (_theme !== 'disabled') {
                let str = this.input.val();
                this.input.val(replaceEmojiCodes(str));
            }
            return fnSend.apply(this, arguments);
        };
    },
    wrapMessage: function(wrapped, message) {
        wrapped.find('span').addBack().contents().filter(function() { return this.nodeType == 3})
            .replaceWith(function() {
                var data = this.data
                    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return emoji.parse(data);
            });
    },
    parse: function(str) {
        switch (_theme) {
            case 'twemoji':
                return twemoji.parse(str, tw_options);
            case 'emojione':
                return emojione.unicodeToImage(str);
        }

        return str;
    },
    theme: function(value) {
        _theme = value;
    }
};

export default emoji
