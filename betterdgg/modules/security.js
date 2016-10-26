import casino from './casino';
import emoji from './emoji';
import emoticons from './emoticons';
import formatters from './formatters';
import overrustle from './overrustle';
import spooky from './spooky';

function secureWrap(proto, target) {
    var fnTarget = proto[target];
    proto[target] = function() {
        var elem = $(fnTarget.apply(this, arguments));

        // Let these formatters see the elements to avoid re-parsing html
        overrustle.wrapMessage(elem, this);
        emoticons.wrapMessage(elem, this);
        formatters.wrapMessage(elem, this);
        spooky.wrapMessage(elem, this);
        casino.wrapMessage(elem, this);
        emoji.wrapMessage(elem, this);

        elem.find('applet, body, base, embed, frame, frameset,'
            + 'head, html, iframe, link, meta, object, script, style, title,'
            + '[onblur], [onchange], [onclick], [ondblclick], [onfocus],'
            + '[onkeydown], [onkeyup], [onload], [onmousedown],'
            + '[onmousemove], [onmouseout], [onmouseover],'
            + '[onmouseup], [onreset], [onscroll], [onselect],'
            + '[onsubmit], [onunload]').remove();

        return elem.get(0).outerHTML;
    };
}

let security = {
    init: function() {
        secureWrap(ChatUserMessage.prototype, 'wrapMessage');
        secureWrap(ChatEmoteMessage.prototype, 'wrapMessage');
        secureWrap(ChatBroadcastMessage.prototype, 'wrapMessage');
    }
};

export default security
