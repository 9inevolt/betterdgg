// load settings module before everything else
window.BetterDGG.settings.init();

for (var module in window.BetterDGG) {
    if (module !== 'settings' && window.BetterDGG[module].init) {
        try {
            window.BetterDGG[module].init();
        }
        catch (e) {
            console.log(e)
        }
    }
}
