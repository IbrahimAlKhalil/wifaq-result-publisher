import {app, BrowserWindow, ipcMain} from 'electron';
import './db-connector';
import './crud';

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

    // Hide window menu
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
    // Don't quit application based on connection window close event.
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
    // The renderer process requested to create a new window and close the old one

    // Don't let the window-all-closed event handler to quit the application
    quit = false;

    // Close the old window
    mainWindow.close();

    // Create new app window
    createWindow({
        height: 680,
        width: 900,
        minHeight: 680,
        minWidth: 900,
        useContentSize: true
    });

    // Let the window-all-closed event handler to quit the application
    quit = true;
});
