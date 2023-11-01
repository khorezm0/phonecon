// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library
// goTo Neutralino.os.open("https://neutralino.js.org/docs");
// msgBox  Neutralino.os.showMessageBox("Version information", `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);

let isMaximizedAtStart;
Neutralino.window.isMaximized().then(res => isMaximizedAtStart = res);

function setTray() {
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }

    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "OPEN", text: "Open"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "OPEN":
            Neutralino.window.show();
            Neutralino.window.maximize();
            if (!isMaximizedAtStart)  {
                setTimeout(() => {
                    Neutralino.window.unmaximize();
                }, 2)
            }
            break;
        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}

function onWindowClose() {
    // Neutralino.app.exit();
    Neutralino.window.hide();
    return true;
}

Neutralino.init();

Neutralino.window.setDraggableRegion(document.querySelector("#app-top"));
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if(NL_OS !== "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}

