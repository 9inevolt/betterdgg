;(function(bdgg) {
    bdgg.test = function() {
        var m = destiny.chat.onMSG({data:'>BetterDGG DESBRO ASLAN DJAslan LUL LUL LUL',
            nick:'BetterDGG', features:[]});
        destiny.chat.gui.push(m);
        setTimeout(function() { destiny.chat.onMUTE({data: 'BetterDGG'}) }, 3000);
    };

    bdgg.test2 = function() {
        destiny.chat.gui.autoCompletePlugin.addData('GamerzKit_TV', Date.now());
        destiny.chat.gui.autoCompletePlugin.addData('OverRustla', Date.now());
        var m = m=destiny.chat.onMSG({data:'Check tab completion of GameOfThrows and OverRustle',
            nick:'BetterDGG', features:[]});
        destiny.chat.gui.push(m);
    };

    bdgg.test3 = function(emote, count) {
        emote = emote || 'DESBRO';
        count = count || 5;
        for (var i=0; i<count; i++) {
            var m = destiny.chat.onMSG({data:emote, nick:'BetterDGG', features:[]});
            m && destiny.chat.gui.push(m);
        }
    };

    bdgg.test4 = function() {
        var emoticons = bdgg.emoticons.EMOTICONS;
        for (var i=0; i<emoticons.length; i++) {
            var m = destiny.chat.onMSG({data:emoticons[i], nick:'BetterDGG', features:[]});
            m && destiny.chat.gui.push(m);
        }
    };
}(window.BetterDGG = window.BetterDGG || {}));
