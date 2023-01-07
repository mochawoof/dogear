let bark = new Audio("bark.ogg");
let bclicks = 0;
let allPages = null;
let updating = false;

function rnd(max) {
    return Math.floor((window.crypto.getRandomValues(new Uint8ClampedArray([0])) / 255) * max);
}

function generateHint() {
    let hints = [
        "Your scroll position is saved with your pages.",
        "Your saved pages sync across all your devices!"
    ];
    let rarehints = [
        "Maybe if you click the dog enough times, it'll bark?",
        "haiii :3"
    ];
    let ch = rnd(25);
    console.log(ch);
    if (ch != 1) {
        msg = hints[rnd(hints.length)];
    } else {
        msg = rarehints[rnd(rarehints.length)];
    }
    document.getElementById("hint").innerText = "Hint: " + msg;
}
generateHint();

function getPages(cb) {
    browser.storage.sync.get().then((got) => {
        cb(got);
    });
}

function updatePages(cb) {
    getPages(function (pages) {
        allPages = pages;
        document.getElementById("pageCount").innerText = Object.keys(allPages).length + " pages";
        if (cb) {
            cb();
        }
    });
}

function removePage(e) {
    updating = true;
    let li = e.target.parentNode;
    let cid = li.id;
    browser.storage.sync.remove(cid).then(() => {
        updateList();
        updating = false;
    });
    li.remove();
}

function updateList() {
    let pages = document.getElementById("pages");
    pages.innerHTML = "";
    updatePages(function() {
        let keys = Object.keys(allPages);
        let values = Object.values(allPages);
        for (i=0; i<keys.length; i++) {
            let n = `<li id=${keys[i]}>
                <a href="${values[i].url}#DOGEAR__${values[i].scroll}">${values[i].url}</a>
                <a class="delPage" href="#">&#10006;</a>
                </li>`;
            pages.innerHTML += n;
        }
        let delPages = document.querySelectorAll(".delPage");
        for (i=0; i<delPages.length; i++) {
            delPages[i].addEventListener("click", removePage);
        }
        updating = false;
    });
}
updateList();

updatePages(function () {
    console.log(Object.keys(allPages));
});

document.getElementById("clearList").addEventListener("click", function () {
    browser.storage.sync.clear();
    updateList();
});

document.getElementById("savePage").addEventListener("click", function () {
    if (!updating) {
        updating = true;
        browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
            browser.tabs.executeScript(
                tabs[0].id,
                {
                    code: `
                document.scrollingElement.scrollTop;
            `
                }).then((r) => {
                    let lkey = Object.keys(allPages).length + 1;
                    let toAdd = {};
                    toAdd[lkey] = {
                        "url": tabs[0].url,
                        "scroll": r
                    };

                    browser.storage.sync.set(toAdd).then(() => {
                        updateList();
                    });
                });
        });
    }
});

let icon = document.getElementById("icon")
icon.addEventListener("click", function () {
    if (bark.paused) {
        bclicks++;
        if (bclicks > 9) {
            bark.play();
            icon.style.animation = "bounce 500ms 2";
            icon.addEventListener("animationend", function () {
                icon.style.animation = "";
            });
            bclicks = 0;
        }
    }
});