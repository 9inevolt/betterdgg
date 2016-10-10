import settings from './settings';

var chat, stream;

let leftchat = {
    init: function() {
        var URL = document.referrer;
        if(URL.search("overrustle") < 0) {
            stream = $('#stream-panel', parent.document);
            chat = $('#chat-panel', parent.document);
            this.leftBoys(settings.get('bdgg_left_chat'));
            this.resizeTakeOver();
            settings.addObserver((key, val) => {
                if (key === 'bdgg_left_chat')
                    this.leftBoys(val);
            });
        }
    },
    leftBoys: function(val) {
        var resizeBar = $('#chat-panel-resize-bar', parent.document);
        if (val) {
            stream.css('float', 'right');
            chat.css('float', 'left');
            resizeBar.css({
                'left': 'auto',
                'right': 0
            });
        } else {
            stream.css('float', 'left');
            chat.css('float', 'right');
            resizeBar.css({
                'left': 0,
                'right': 'auto'
            });
        }
    },
    resizeTakeOver: function() {
        var resizeBar = $('#chat-panel-resize-bar', parent.document);
        var clone = resizeBar.clone();
        resizeBar.remove();
        clone.appendTo(chat);
        resizeBar = $('#chat-panel-resize-bar', parent.document);

        function resizeFrames(w, leftChat) {
            var chatw = chat.width() + w;
            stream.css('width', '-moz-calc(100% - '+ chatw +'px)');
            stream.css('width', '-webkit-calc(100% - '+ chatw +'px)');
            stream.css('width', '-o-calc(100% - '+ chatw +'px)');
            stream.css('width', 'calc(100% - '+ chatw +'px)');
            chat.css('width', chatw);
            var side = (leftChat) ? 'right' : 'left';
            resizeBar.css(side, 0);
        }

        resizeBar.on('mousedown', function(e) {
            e.preventDefault();
            var leftChat = settings.get('bdgg_left_chat');
            var side = (leftChat) ? 'right' : 'left';
            resizeBar.addClass('active');

            var offsetX = e.clientX;
            var sx = resizeBar.position().left;

            var overlay = $('<div class="overlay" />');
            overlay.appendTo(parent.document.body);


            var mouseMoveHandler = function(e) {
                e.preventDefault();

                var offset = (leftChat) ? (-1  * (e.clientX - offsetX)) : (sx + (e.clientX - offsetX));
                resizeBar.css(side, offset);
            };

            var mouseUpHandler = function(e) {
                e.preventDefault();

                resizeBar.removeClass('active');
                overlay.remove();
                $(parent.document).unbind('mousemove.chatresize');
                $(parent.document).unbind('mouseup.chatresize');

                var w = parseInt(resizeBar.css(side)) * -1;
                resizeFrames(w, leftChat);
            };

            $(parent.document).on('mousemove.chatresize', mouseMoveHandler);
            $(parent.document).on('mouseup.chatresize', mouseUpHandler);
        });
    }
};

export default leftchat
