;(function(bdgg) {
    TWITCH_URL  = /http:\/\/(?:www\.)?twitch.tv\/(\w+)\/?$/;
    HITBOX_URL  = /http:\/\/(?:www\.)?hitbox.tv\/(\w+)\/?$/;
    CASTAMP_URL = /http:\/\/(?:www\.)?castamp.com\/live\/(\w+)$/;
    USTREAM_CHANNEL_URL = /http:\/\/(?:www\.)?ustream.tv\/(\w+)\/?$/;
    USTREAM_EMBED_URL = /http:\/\/(?:www\.)?ustream.tv\/(?:embed|channel\/id)\/(\d+)\/?$/;

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
        else if (match = USTREAM_CHANNEL_URL.exec(href)) {
            // needs to run as content script
            /*
            $.ajax(href, { async: false, dataType: 'text',
                success: function(data) {
                    var umatch;
                    if (umatch = /"cid":(\d+)/.exec(data)) {
                        href = _link('ustream', umatch[1]);
                        elem.setAttribute('href', href);
                        elem.textContent = href;
                    }
                }
            });
            */
            return;
        }
        else if (match = USTREAM_EMBED_URL.exec(href)) {
            href = _link('ustream', match[1]);
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
