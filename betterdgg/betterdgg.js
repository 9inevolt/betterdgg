for (var module in window.BetterDGG) {
    if (window.BetterDGG[module].init) {
        window.BetterDGG[module].init();
    }
}
