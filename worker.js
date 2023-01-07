let href = location.href
if (href.match(/(\#DOGEAR\_\_)/g)) {
    let di = href.indexOf("#DOGEAR__");
    let scr = href.substring(di + "#DOGEAR__".length, href.length);
    window.scroll({
        top:scr,
        left:0,
        behavior:"smooth"
    });
    history.pushState({}, "", location.href.substring(0, di));
}