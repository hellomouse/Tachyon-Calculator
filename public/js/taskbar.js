const { remote } = require('electron');

let isMaxed = false;
let posCache;

module.exports = {
    close: () => { window.close(); },
    max: () => {
        if (isMaxed) {
            window.moveTo(posCache.x, posCache.y);
            window.resizeTo(posCache.width, posCache.height);
        } else {
            posCache = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds();
            window.moveTo(0, 0);
            window.resizeTo(screen.width, screen.height);
        }
        isMaxed = !isMaxed;
    },
    min: () => { remote.BrowserWindow.getFocusedWindow().minimize(); }
};

