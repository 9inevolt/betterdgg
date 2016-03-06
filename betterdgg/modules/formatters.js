;(function(bdgg) {
    bdgg.formatters = (function() {
        return {
            init: function() {
                // deleted messages
                destiny.chat.gui.removeUserMessages = function(username) {
                    this.lines.children('div[data-username="'+username.toLowerCase()+'"]').addClass('bdgg-muted');
                };

                $(destiny.chat.gui.lines).on('click', '.bdgg-muted a.externallink', function(e) {
                    return false;
                });

                // >greentext
                var BDGGGreenTextFormatter = {
                    format: function(str, user) {
                        var loc = str.indexOf("&gt;")
                        if(loc === 0){
                            str = '<span class="greentext">'+str+'</span>';
                        }
                        return str;
                    }
                }

                var _sr_url = function(url) {
                    return "http://www.reddit.com" + url;
                };

                var _sr_replacer = function(match, p1, url, p3) {
                    return p1 + '<a target="_blank" class="externallink" href="'
                        + _sr_url(url) + '">' + url + '</a>' + p3;
                };

                var bdggsubredditregex = /(^|\s)(\/r\/[A-Za-z]\w{1,20})($|\s|[\.\?!,])/g;

                var BDGGSubredditFormatter = {
                    format: function(str, user) {
                        return str.replace(bdggsubredditregex, _sr_replacer);
                    }
                }

                destiny.chat.gui.formatters.push(BDGGGreenTextFormatter);
                destiny.chat.gui.formatters.push(BDGGSubredditFormatter);
            },
            wrapMessage: function(elem, message) {
                elem.find('a[href]').each(function(i, a) {
                    var href = a.getAttribute('href');
                    var scheme = /(https?|ftp):\/\//gi;
                    var match;
                    while (match = scheme.exec(href)) {
                        if (match.index > 6) {
                            a.setAttribute('href', href.substring(0, match.index));
                            break;
                        }
                    }
                });
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
