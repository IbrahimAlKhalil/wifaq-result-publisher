import {app, BrowserWindow, ipcMain} from 'electron';
import './db-connector';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow(config) {
    mainWindow = new BrowserWindow(config);

    mainWindow.loadURL(winURL);
    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

// Connection window config
const connConfig = {
    height: 580,
    width: 400,
    resizable: false,
    useContentSize: true
};

app.on('ready', () => {
    createWindow(connConfig);
});


let quit = true;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && quit) {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow(connConfig);
    }
});


ipcMain.on('createNewWindow', () => {
    quit = false;

    mainWindow.close();

    createWindow({
        height: 680,
        width: 900,
        minHeight: 680,
        minWidth: 900,
        useContentSize: true
    });

    quit = true;
});
