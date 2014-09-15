function inject(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn.toString() + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

inject(injectedBetterDGG);
