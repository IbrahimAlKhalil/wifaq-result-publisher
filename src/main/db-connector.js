import {ipcMain, Notification} from "electron";
import * as sql from 'mssql';
import mongoClient from './mongo-singleton';

let connectionInfo = {
    mssql: false,
    mongodb: false
};

// This function will be used to connect mssql server
function connectMssql(data) {
    return new Promise(async (resolve, reject) => {
        try {
            await sql.connect({
                user: data.username,
                password: data.password,
                server: data.host,
                port: parseInt(data.port), // Port must be integer
                database: data.database
            });

            resolve();
        } catch (e) {
            // Something bad happened
            reject(e);
        }
    });
}


ipcMain.on('connectionInfo', event => {
    // The renderer process asked for connection info

    event.sender.send('connectionInfo', connectionInfo);
});


ipcMain.on('connect', async (event, payload) => {
    // The renderer process asked for database connection

    let connector;
    let serverName;

    // Check what type of connection to be made
    if (payload.type === 'mssql') {
        connector = connectMssql;
        serverName = 'SQL';
    } else {
        connector = mongoClient;
        serverName = 'MongoDB';
    }

    try {
        // Try to connect
        await connector(payload.data);

        // Connected!
        // Let the renderer process know about it
        event.sender.send('connect', true);
        connectionInfo[payload.type] = true;

        // Show success message
        (new Notification({
            title: 'Wifaq Result Publisher',
            body: `Connected to ${serverName} Server successfully!`
        })).show();

    } catch (e) {
        // Something bad happened

        event.sender.send('connect', false);

        // Show error message
        (new Notification({
            title: 'Wifaq Result Publisher',
            body: e.message
        })).show();
    }
});
