import * as sql from 'mssql';
import {ipcMain} from 'electron';
import {MongoClient} from 'mongodb';
import {getMongoUrl} from './db-connector';
import moment from 'moment';

const mongoClientOptions = {useNewUrlParser: true};

ipcMain.on('provideTables', async event => {

    // Get table list
    // We don't need to reconnect SQL server because SQL client has a concept of global connection pool
    // and of course we're already connected
    const tables = await sql.query("SELECT o.NAME as name,\n" +
        "  i.rowcnt as rows \n" +
        "FROM sysindexes AS i\n" +
        "  INNER JOIN sysobjects AS o ON i.id = o.id \n" +
        "WHERE i.indid < 2  AND OBJECTPROPERTY(o.id, 'IsMSShipped') = 0\n" +
        "ORDER BY o.NAME");

    // Connect mongodb server
    const client = await MongoClient.connect(getMongoUrl(), mongoClientOptions);

    // Get all the documents in session collection
    const docs = client.db('results').collection('sessions').find();

    // Get the result in array
    const sessions = await docs.toArray();

    // We need nothing more than id to check whether the table is already published
    const sessionNames = sessions.map(session => {
        return session._id;
    });

    // Close the connection
    client.close();

    // Iterate over the table list and check whether the table is already published
    event.sender.send('getTables', tables.recordset.map(table => {
        table.published = sessionNames.includes(table.name.replace('stu_result', ''));
        return table;
    }));
});

ipcMain.on('calculateEta', async (event, tables) => {
    // Calculate ETA and send to the renderer process
    if (!tables.length) {
        return;
    }

    const insertionStartTime = Date.now();

    const students = await sql.query(`SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY MID) AS Seq FROM ${tables[0].name})t
                                      WHERE Seq BETWEEN 0 AND 200`);

    // Connect mongodb server
    const mongoClient = await MongoClient.connect(getMongoUrl(), mongoClientOptions);

    // Create Testing database
    const etaCalculation = mongoClient.db('eta_calculation');

    // Insert Results
    await etaCalculation.collection('results').insertMany(organizeStudents(students, getYearFromName(tables[0].name)));

    // Starting time of index creation and end time of insertion
    const indexingStartTime = Date.now();

    // Create index
    await etaCalculation.collection('results').createIndex({
        roll: 1,
        year: 1,
        classId: 1
    }, {
        unique: true
    });

    const endTime = Date.now();

    // Drop testing database
    await etaCalculation.dropDatabase();

    const eta = (indexingStartTime - insertionStartTime + endTime - indexingStartTime) / 200 * tables.map(table => table.rows.total).reduce((a, b) => a + b);

    event.sender.send('eta', {
        insertion: moment(insertionStartTime).fromNow()
    });
});

ipcMain.on('publish', async (event, tables) => {
    // Calculate ETA and send to the renderer process
    if (!tables.length) {
        return;
    }

    publish().then(() => {
        event.sender.send('published');
    });
});


function organizeStudents(students, year) {
    return students.recordset.map(student => {
        const results = [];

        for (let i = 1; i < 12; i++) {
            results.push({
                name: student[`SubLabel_${i}`],
                value: student[`SubValue_${i}`]
            });
        }

        return {
            name: student.Name,
            roll: student.Roll,
            father: student.Father,
            dob: student.DateofBirth,
            absence: student.Absence,
            gender: student.SRType,
            markaj: student.Markaj,
            elhaq: student.MElhaq,
            division: student.Division,
            madrasa: student.Madrasa,
            graceLabel: student.GraceLabel,
            graceValue: student.GraceValue,
            position: student.Positions,
            classId: student.CID,
            regId: student.ALID,
            posSub: student.PosSub,
            year,
            results
        };
    });
}

function getYearFromName(tableName) {
    return tableName.replace('stu_result', '');
}


function publish(db, tables, insertPerQuery, iterationCount) {
    return new Promise(async resolve => {

        // Total rows to be published
        const totalRows = tables.map(table => table.rows.total).reduce((a, b) => a + b);
        let rowsFinished = 0;

        // Connect mongodb server
        const mongoClient = await MongoClient.connect(getMongoUrl(), mongoClientOptions);

        // MongoDB Database
        const etaCalculation = mongoClient.db(db);

        const insert = async () => {
            while (rowsFinished < totalRows) {
                const students = await sql.query(`SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY MID) AS Seq FROM ${tables[0].name})t
                                      WHERE Seq BETWEEN 0 AND 200`);
            }
        };

    });
}


function publishTable() {

}





