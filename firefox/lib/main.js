var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
 
pageMod.PageMod({
    include: "*.destiny.gg",
    contentScriptFile: data.url("betterdgg.js"),
    contentStyleFile: [ data.url("betterdgg.css"), data.url("emoticons.css") ],
    attachTo: [ "top", "frame" ]
});
