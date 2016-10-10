import settings from './settings';

const TWITCH_URL  = /http:\/\/(?:www\.)?twitch.tv\/(\w+)\/?$/;
const HITBOX_URL  = /http:\/\/(?:www\.)?hitbox.tv\/(\w+)\/?$/;
const CASTAMP_URL = /http:\/\/(?:www\.)?castamp.com\/live\/(\w+)$/;
const USTREAM_CHANNEL_URL = /http:\/\/(?:www\.)?ustream.tv\/(?:channel\/)?([\w-]+)\/?$/;
const USTREAM_EMBED_URL = /http:\/\/(?:www\.)?ustream.tv\/(?:embed|channel\/id)\/(\d+)\/?$/;

var _channels = {};

function _initStrims() {
    // hook into handle command
    var fnHandleCommand = destiny.chat.handleCommand;
    destiny.chat.handleCommand = function(str) {
        var cmd = str.trim();
        if (/^strims\b/.test(cmd)) {
            var match;
            if (match = cmd.match(/^strims(?: (\d+))?$/)) {
                var count = match[1] || 5;
                window.postMessage({type: 'bdgg_overrustle_get_strims', count: count}, '*');
            } else {
                destiny.chat.gui.push(new ChatInfoMessage("Format: /strims {optional #}"));
            }
        } else {
            fnHandleCommand.apply(this, arguments);
        }
    };

    var listener = function(e) {
        if (window != e.source || e.data.type != 'bdgg_overrustle_strims' ) {
            return;
        }

        for (var i=0; i<e.data.strims.length; i++) {
            var strim = e.data.strims[i];
            //console.log(strim);
            destiny.chat.gui.push(new BDGGChatStrimMessage(strim));
        }
    };
    window.addEventListener('message', listener);

    function BDGGChatStrimMessage(strim) {
        this.strim = strim;
        this.url = 'http://www.overrustle.com' + strim['url'];
        this.viewers = strim['viewers'];
        this.name = strim['name'] || strim['channel'];
        this.title = strim['title'];
        this.platform = strim['platform'];
    };
    BDGGChatStrimMessage.prototype = Object.create(ChatUIMessage.prototype);
    BDGGChatStrimMessage.prototype.constructor = BDGGChatStrimMessage;

    BDGGChatStrimMessage.prototype.html = function() {
        var elem = $('<div class="ui-msg bdgg-strim-msg"></div>');
        $('<a target="_blank" class="externallink"></a>').attr('href', this.url)
            .text(this.text())
            .prepend(this.icon())
            .appendTo(elem);
        return elem[0].outerHTML;
    };

    BDGGChatStrimMessage.prototype.text = function() {
        var txt = ' ';
        if (this.name) {
            txt += this.name;
        } else {
            txt += this.strim['url'];
        }

        if (this.title) {
            txt += ' - ' + this.title;
        }

        if (this.viewers != null) {
            txt += ' (' + this.viewers + ')';
        }

        return txt;
    };

    BDGGChatStrimMessage.prototype.icon = function() {
        var ico = "icon-bdgg-play";
        if (this.platform == 'twitch') {
            ico = "icon-bdgg-platform-twitch";
        } else if (this.platform == 'ustream') {
            ico = "icon-bdgg-platform-ustream";
        }

        return '<i class="' + ico + '"></i>';
    };
};

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

var _enabled = false;

let overrustle = {
    init: function() {
        this.convertLinks(settings.get('bdgg_convert_overrustle_links'));
        settings.addObserver((key, value) => {
            if (key == 'bdgg_convert_overrustle_links') {
                this.convertLinks(value);
            }
        });

        _initStrims();
    },
    convertLinks: function(value) {
        _enabled = value;
    },
    wrapMessage: function(elem, message) {
        if (!_enabled)
            return;

        elem.find('a[href]').each(function(i, a) {
            _convert(a);
        });
    }
};

export default overrustle
