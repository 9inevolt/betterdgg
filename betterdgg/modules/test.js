;(function(bdgg) {
    bdgg.test = function() {
        var m = m=destiny.chat.onMSG({data:'>BetterDGG DESBRO ASLAN DJAslan LUL LUL LUL',
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
    }
}(window.BetterDGG = window.BetterDGG || {}));
