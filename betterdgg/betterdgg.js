for (var module in window.BetterDGG) {
    if (window.BetterDGG[module].init) {
        try {
            window.BetterDGG[module].init();
        }
        catch (e) {
            console.log(e)
            
        }
    }
}