;(function(bdgg) {
    CONTRIBUTORS = [ '9inevolt', 'ILiedAboutCake', 'mellipelli' ];

    bdgg.flair = (function() {
        destiny.UserFeatures['BDGG_CONTRIBUTOR'] = 'bdgg_contributor';
        var fnGetFeatureHTML = ChatUser.prototype.getFeatureHTML;
        var bdggGetFeatureHTML = function() {
            var icons = fnGetFeatureHTML.apply(this, arguments);
            if (CONTRIBUTORS.indexOf(this.username) > -1) {
                icons += '<i class="icon-bdgg-contributor" title="Better Destiny.gg Contributor"/>';
            }
            return icons;
        };
        ChatUser.prototype.getFeatureHTML = bdggGetFeatureHTML;
        return {};
    })();
}(window.BetterDGG = window.BetterDGG || {}));
