import shortid from 'shortid';
import { postMessage } from '../messaging';
import settings from './settings';

const TWITCH_URL = /http:\/\/(?:www\.)?twitch.tv\/(\w+)\/?$/;
const HITBOX_URL = /http:\/\/(?:www\.)?hitbox.tv\/(\w+)\/?$/;
const USTREAM_CHANNEL_URL = /http:\/\/(?:www\.)?ustream.tv\/(?:channel\/)?([\w-]+)\/?$/;
const USTREAM_EMBED_URL = /http:\/\/(?:www\.)?ustream.tv\/(?:embed|channel\/id)\/(\d+)\/?$/;

let _channels = {};

function _initStrims() {
    // hook into handle command
    let fnHandleCommand = destiny.chat.handleCommand;
    destiny.chat.handleCommand = function(str) {
        let cmd = str.trim();
        if (/^str(?:(?:ea|i)ms?)?\b/.test(cmd)) {
            let match;
            if (match = cmd.match(/^str(?:(?:ea|i)ms?)?(?: (\d+))?$/)) {
                let count = match[1] || 5;
                postMessage('bdgg_overrustle_get_strims', {count})
                    .then(data => {
                        for (let strim of data.strims) {
                            destiny.chat.gui.push(new BDGGChatStrimMessage(strim));
                        }
                    })
                    .catch(() => {});
            } else {
                destiny.chat.gui.push(new ChatInfoMessage("Format: /str(ims) {optional #}"));
            }
        } else {
            fnHandleCommand.apply(this, arguments);
        }
    };

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
        let elem = $('<div class="ui-msg bdgg-strim-msg"></div>');
        $('<a target="_blank" class="externallink"></a>').attr('href', this.url)
            .text(this.text())
            .prepend(this.icon())
            .appendTo(elem);
        return elem[0].outerHTML;
    };

    BDGGChatStrimMessage.prototype.text = function() {
        let txt = ' ';
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
        let ico = "icon-bdgg-play";
        if (this.platform == 'twitch') {
            ico = "icon-bdgg-platform-twitch";
        } else if (this.platform == 'ustream') {
            ico = "icon-bdgg-platform-ustream";
        }

        return '<i class="' + ico + '"></i>';
    };
}

function _link(s, stream) {
    return 'http://overrustle.com/destinychat?s='
        + s + '&stream=' + stream;
}

function _convert(elem) {
    let href = elem.getAttribute('href');
    let match;

    if (match = TWITCH_URL.exec(href)) {
        href = _link('twitch', match[1]);
    }
    else if (match = HITBOX_URL.exec(href)) {
        href = _link('hitbox', match[1]);
    }
    else if (match = USTREAM_EMBED_URL.exec(href)) {
        href = _link('ustream', match[1]);
    }
    else if (match = USTREAM_CHANNEL_URL.exec(href)) {
        if (_channels.hasOwnProperty(href)) {
            href = _channels[href];
        } else {
            // Set the id since the element gets re-parsed later
            let elemId = shortid.generate();
            elem.id = elemId;

            postMessage('bdgg_ustream_url', {text: href})
                .then(data => {
                    let link = _link('ustream', data.id);
                    _channels[href] = link;

                    let newElem = document.getElementById(elemId);
                    if (newElem) {
                        newElem.setAttribute('href', link);
                        newElem.textContent = link;
                    }
                })
                .catch(() => {});

            return;
        }
    } else {
      // Don't prepend http to other urls
      return;
    }

    elem.setAttribute('href', href);
    elem.textContent = href;
}

let _enabled = false;

let overrustle = {
    init: function() {
        this.convertLinks(settings.get('bdgg_convert_overrustle_links'));
        settings.on('bdgg_convert_overrustle_links', value => { this.convertLinks(value); });

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

export default overrustle;
