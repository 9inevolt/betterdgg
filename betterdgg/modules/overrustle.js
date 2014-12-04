;(function(bdgg) {
    TWITCH_URL  = /http:\/\/(?:www\.)?twitch.tv\/(\w+)\/?$/;
    HITBOX_URL  = /http:\/\/(?:www\.)?hitbox.tv\/(\w+)\/?$/;
    CASTAMP_URL = /http:\/\/(?:www\.)?castamp.com\/live\/(\w+)$/;
    USTREAM_CHANNEL_URL = /http:\/\/(?:www\.)?ustream.tv\/(?:channel\/)?([\w-]+)\/?$/;
    USTREAM_EMBED_URL = /http:\/\/(?:www\.)?ustream.tv\/(?:embed|channel\/id)\/(\d+)\/?$/;

    var _channels = {};

    function _randString(len) {
        var s = '';
        for (var i=0; i<len; i++) {
            s += String.fromCharCode(Math.floor(97 + Math.random() * (123 - 97)));
        }
        return s;
    };

    function _link(s, stream) {
        return 'http://overrustle.com/destinychat?s='
            + s + '&stream=' + stream;
    };

    function _convert(elem) {
        var href = elem.getAttribute('href');
        var match;

        if (match = TWITCH_URL.exec(href)) {
            href = _link('twitch', match[1]);
        }
        else if (match = HITBOX_URL.exec(href)) {
            href = _link('hitbox', match[1]);
        }
        else if (match = CASTAMP_URL.exec(href)) {
            href = _link('castamp', match[1]);
        }
        else if (match = USTREAM_EMBED_URL.exec(href)) {
            href = _link('ustream', match[1]);
        }
        else if (match = USTREAM_CHANNEL_URL.exec(href)) {
            if (_channels.hasOwnProperty(href)) {
                href = _channels[href];
            } else {
                // Set the id since the element gets re-parsed later
                var elemId = _randString(5);
                elem.id = elemId;

                var listener = function(e) {
                    debugger;
                    if (window != e.source ||
                            e.data.type != 'bdgg_ustream_channel' || e.data.text != href) {
                        return;
                    }

                    var link = _link('ustream', e.data.id);
                    _channels[href] = link;

                    var newElem = document.getElementById(elemId);
                    if (newElem) {
                        newElem.setAttribute('href', link);
                        newElem.textContent = link;
                    }
                    window.removeEventListener('message', listener);
                };
                window.addEventListener('message', listener);
                window.postMessage({type: 'bdgg_ustream_url', text: href}, '*');
                setTimeout(function() { window.removeEventListener('message', listener); }, 10000);
                return;
            }
        } else {
          // Don't prepend http to other urls
          return;
        }

        elem.setAttribute('href', href);
        elem.textContent = href;
    };

    bdgg.overrustle = (function() {
        var _enabled = false;
        return {
            init: function() {
                var BDGGOverrustleFormatter = {
                    format: function(str, user) {
                        if (!_enabled)
                            return str;

                        var wrapped = $('<span>').append(str);
                        wrapped.find('a[href]').each(function(i, elem) {
                            _convert(elem);
                        });

                        return wrapped.html();
                    }
                };

                destiny.chat.gui.formatters.push(BDGGOverrustleFormatter);

                bdgg.overrustle.convertLinks(bdgg.settings.get('bdgg_convert_overrustle_links'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_convert_overrustle_links') {
                        bdgg.overrustle.convertLinks(value);
                    }
                });
            },
            convertLinks: function(value) {
                _enabled = value;
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));
