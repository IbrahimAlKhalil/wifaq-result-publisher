import {MongoClient} from 'mongodb';

let client = null;

export default function (data) {
    return new Promise(async (resolve, reject) => {
        if (client) {
            return resolve(client);
        }

        try {
            client = await (new MongoClient(`mongodb://${data.username}:${data.password}@${data.host}:${data.port}`, {useNewUrlParser: true})).connect();
            resolve(client);
        } catch (e) {
            reject(e);
        }
    })
}
