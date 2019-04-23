import * as sql from 'mssql';
import {ipcMain, Notification} from 'electron';
import mongoClient from './mongo-singleton';
import bijoy from './bijoy';

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
    const client = await mongoClient();

    // Get all the documents in session collection
    const docs = client.db('results').collection('sessions').find();

    // Get the result in array
    const sessions = await docs.toArray();

    // We need nothing more than id to check whether the table is already published
    const sessionNames = sessions.map(session => {
        return session.name;
    });

    // Exclude tables which aren't for results
    const tablesFiltered = tables.recordset.filter(table => /stu_result\d{4}/.test(table.name))
        .map(table => {
            table.published = sessionNames.includes(table.name.replace('stu_result', ''));
            return table;
        });

    // Iterate over the table list and check whether the table is already published
    event.sender.send('getTables', tablesFiltered);
});

ipcMain.on('publish', async (event, tables) => {
    if (!tables.length) {
        return;
    }

    publish(tables, event).then(() => {
        event.sender.send('published');
        (new Notification({
            title: 'Wifaq Result Publisher',
            body: `The publishing process has been completed successfully!`
        })).show();
    });
});

function organizeStudents(students, year) {
    return students.recordset.map(student => {
        const results = [];

        for (let i = 1; i < 12; i++) {
            results.push({
                name: bijoy(student[`SubLabel_${i}`]),
                value: student[`SubValue_${i}`]
            });
        }

        return {
            name: bijoy(student.Name),
            roll: student.Roll,
            father: bijoy(student.Father),
            dob: student.DateofBirth,
            absence: student.Absence,
            gender: student.SRType,
            markaj: bijoy(student.Markaj),
            elhaq: student.MElhaq,
            division: bijoy(student.Division),
            madrasa: bijoy(student.Madrasha),
            graceLabel: bijoy(student.GraceLabel),
            graceValue: student.GraceValue,
            position: student.Positions,
            classId: student.CID,
            regId: student.ALID,
            posSub: bijoy(student.PosSub),
            year: bijoy(year),
            results
        };
    });
}

function getYearFromName(tableName) {
    return tableName.replace('stu_result', '');
}

function publish(tables, event, insertPerQuery = 200, iterationCount = Infinity) {

    return new Promise(async resolve => {
        let currentTableIndex = 0;
        let insertedRows = 0;

        // Connect mongodb server
        const client = await mongoClient();

        // MongoDB Database
        const db = client.db('results');

        const publishTable = () => {
            return new Promise(resolve1 => {
                const currentTable = tables[currentTableIndex];

                // Change current process
                event.sender.send('currentProcess', {
                    type: 'insertion',
                    table: currentTable.name,
                });

                // Insert documents
                promiseChain(insert, isFinite(iterationCount) ? iterationCount : Math.ceil(currentTable.rows.total / insertPerQuery), false).then(() => {
                    currentTableIndex++;
                    insertedRows = 0;

                    event.sender.send('tablePublished', currentTable.name);
                    resolve1();
                });
            });
        };


        const insert = async () => {
            const startTime = Date.now();
            const students = await sql.query(`SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY MID) AS Seq FROM ${tables[currentTableIndex].name})t
                                      WHERE Seq BETWEEN ${insertedRows + 1} AND ${insertedRows + insertPerQuery}`);
            insertedRows += insertPerQuery;

            await db.collection('students').insertMany(organizeStudents(students, getYearFromName(tables[currentTableIndex].name)));

            event.sender.send('rowsInserted', {
                count: students.recordset.length,
                time: (Date.now() - startTime) / insertPerQuery
            });
        };

        const indexes = [
            {
                fields: ['roll', 'year', 'classId'],
                unique: true
            },

            {
                fields: ['year', 'classId', 'elhaq'],
                unique: false
            },

            {
                fields: ['year', 'classId', 'gender'],
                unique: false
            },

            {
                fields: ['elhaq'],
                unique: false
            }
        ];

        let currentIndexIndex = 0;
        const doIndex = async () => {
            let fields = {};
            let currentIndex = indexes[currentIndexIndex++];

            currentIndex.fields.forEach(field => {
                fields[field] = 1;
            });

            await db.collection('students').createIndex(fields, {
                unique: currentIndex.unique
            });
        };

        // Insert documents
        await promiseChain(publishTable, tables.length);

        event.sender.send('currentProcess', {
            type: 'indexing'
        });

        // Create indexes
        await promiseChain(doIndex, indexes.length);

        // Session entries
        await db.collection('sessions').insertMany(tables.map(table => ({
            name: getYearFromName(table.name)
        })));

        // Comment this line before going to production

        // db.dropDatabase();

        resolve();
    });
}

function promiseChain(func, times = 1, resolveData = true) {
    return new Promise(async resolve => {
        if (typeof func !== "function") {
            return resolve();
        }

        const resolves = [];

        for (let i = 1; i < times + 1; i++) {
            const data = await func();

            resolveData && resolves.push(data);

            if (i === times) {
                return resolve(resolves);
            }
        }
    });
}





