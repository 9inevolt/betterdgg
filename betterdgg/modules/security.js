;(function(bdgg) {
    bdgg.security = (function() {
        var fnWrapMessage = ChatUserMessage.prototype.wrapMessage;
        ChatUserMessage.prototype.wrapMessage = function() {
            var elem = $(fnWrapMessage.apply(this, arguments));
            elem.find('applet, body, base, embed, frame, frameset,'
                + 'head, html, iframe, link, meta, object, script, style, title,'
                + '[onblur], [onchange], [onclick], [ondblclick], [onfocus],'
                + '[onkeydown], [onkeyup], [onload], [onmousedown],'
                + '[onmousemove], [onmouseout], [onmouseover],'
                + '[onmouseup], [onreset], [onscroll], [onselect],'
                + '[onsubmit], [onunload]').remove();
            return elem.get(0).outerHTML;
        };
        return {};
    })();
}(window.BetterDGG = window.BetterDGG || {}));
