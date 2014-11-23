;(function(bdgg) {
    bdgg.window = (function() {
        function initDebounce($) {
            function debounce(callback, delay) {
              var self = this, timeout, _arguments;
              return function() {
                _arguments = Array.prototype.slice.call(arguments, 0),
                timeout = clearTimeout(timeout, _arguments),
                timeout = setTimeout(function() {
                  callback.apply(self, _arguments);
                  timeout = 0;
                }, delay);

                return this;
              };
            }

            $.extend($.fn, {
              debounce: function(event, callback, delay) {
                this.bind(event, debounce.apply(this, [callback, delay]));
              }
            });
        }

        return {
            init: function() {
                if (!jQuery.fn.debounce) {
                    initDebounce(jQuery);
                }

                var chatOut = $(destiny.chat.gui.output);

                var fnUpdateScrollValues = destiny.chat.gui.scrollPlugin.updateScrollValues;
                destiny.chat.gui.scrollPlugin.updateScrollValues = function() {
                    fnUpdateScrollValues.call(this, arguments);
                    chatOut.trigger('scrolled');
                };

                var scrollNotify = $('<div id="bdgg-scroll-notify">More messages below</div>');
                scrollNotify.on('click', function() {
                    destiny.chat.gui.scrollPlugin.updateAndScroll(true);
                });

                chatOut.debounce("scrolled", function() {
                    scrollNotify.toggle(!destiny.chat.gui.scrollPlugin.isScrolledToBottom());
                }, 100);

                chatOut.debounce("scrollend", function() {
                    scrollNotify.hide();
                }, 100);

                chatOut.append(scrollNotify);
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
