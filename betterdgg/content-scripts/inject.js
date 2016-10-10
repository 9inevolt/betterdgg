function inject(url) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.src = url;
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

inject(chrome.extension.getURL('/injected.js'));
