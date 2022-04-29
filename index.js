var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
const express = require('express');
const app = express();
let rowsData = [];
var id = 1;

const PORT = process.env.port || 8000;
app.use(express.json());
//create table on app run
db.serialize(function () {
    //db.run("CREATE TABLE crimedata (id int, name TEXT, city TEXT, crime TEXT, policestation TEXT, incidentdate DATE)");
    db.run("CREATE TABLE criminalDetails (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, state TEXT NOT NULL, address TEXT NOT NULL)");
    db.run("CREATE TABLE locationDetails (state TEXT NOT NULL, city TEXT NOT NULL, policestation TEXT PRIMARY KEY NOT NULL, CONSTRAINT staysin FOREIGN KEY (state) REFERENCES criminalDetails(state))");
    db.run("CREATE TABLE crimecategory (category TEXT NOT NULL, description TEXT NOT NULL, PRIMARY KEY (category, description))");
    db.run("CREATE TABLE crimedata (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, incidentdate DATE NOT NULL, description TEXT NOT NULL, CONSTRAINT has FOREIGN KEY (id) REFERENCES criminalDetails(id), CONSTRAINT belongs FOREIGN KEY (category) REFERENCES crimecategory(category))");
});

//db.close();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/add', (req, res) => {
    console.log('Data is', req.body);
    const result = addDataIntoTable(req.body);
    res.send(result)
    //res.sendFile('index.html', { root: __dirname });
});

app.post('/view', (req, res) => {
    console.log('Data is', req.body);
    //viewData().then((data) => {
    viewDataName().then(async(data) => {
        console.log('Data for name table', data);
        // let location1=await viewDataLocation()
        // console.log('Data for location table', location1);
        // let location2=await viewDataCrimeData()
        // console.log('Data for crime table', location2);
        // const obj = {
        //     name: '',
        //     state: '',
        //     city: '',
        //     crime: '',
        //     policestation: '',
        //     incidentdate: ''
        // }
        // let arr = []
        // for (let i=0;i<data.length;i++)
        // {
        //     arr.push({
        //     name: data[i].name,
        //     state: location1[i].state,
        //     city: location1[i].city,
        //     crime: location2[i].crime,
        //     policestation: location1[i].policestation,
        //     incidentdate: location2[i].incidentdate
        //     })
        // }
        // console.log('arr', arr);
        //res.send({ data: rowsData })
        //res.send({ data: arr })
        res.send({ data: rowsData })
    })
    //res.sendFile('index.html', { root: __dirname });
});



app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

const createTable = () => {//
    db.serialize(function () {
        db.run("CREATE TABLE lorem (info TEXT)");
        db.close();
    });
}
const addDataIntoTable = (data) => {
    //const tableName = 'crimedata';
    //const query = `INSERT INTO ${tableName} (name,city,crime,policestation,incidentdate) VALUES (?,?,?,?,?)"`
    //const query = `INSERT INTO ${tableName} (id,name,state) VALUES (?,?,?)"`
    let res;
    try {
        //db.run(`INSERT INTO ${tableName}(name, city, crime, policestation,incidentdate) VALUES(?, ?,?,?,?)`, [data.name, data.city, data.crime, data.policestation, data.incidentdate], (err) => {
        //    if (err) {
        //        console.log(err.message);
        //    }
        //    console.log('Row was added to the table');

        db.run(`INSERT INTO criminalDetails(id, name, state, address) VALUES(?,?,?,?)`, [id, data.name, data.state, data.address], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('Row was added to the table: criminalDetails');
        })
        db.run(`INSERT INTO locationDetails(state, city, policestation) VALUES(?,?,?)`, [data.state, data.city, data.policestation], (err) => {
            if (err) {
                console.log(err.message);
            }
        console.log('Row was added to the table: locationDetails');
        })

        db.run(`INSERT INTO crimecategory(category, description) VALUES(?,?)`, [data.category, data.description], (err) => {
            if (err) {
                console.log(err.message);
            }
        console.log('Row was added to the table: crimeMapping');
        })
        
        db.run(`INSERT INTO crimeData(id, name, category, incidentdate, description) VALUES(?,?,?,?,?)`, [id, data.name, data.category, data.incidentdate, data.description], (err) => {
            if (err) {
                console.log(err.message);
            }
        console.log('Row was added to the table: crimeData');
        })
       id++;
        return { success: true }
    } catch (err) {
        console.log('Error', err);
        return { success: false }
    }

}

// const viewData = () => {
//     const tableName = 'crimedata';
//     const query = `select * from ${tableName}`;
//     let res;
//     return new Promise((resolve, reject) => {
//         try {
//             console.log('query :', query);
//             db.all(query, function (err, rows) {
//                 console.log('rows :', rows);
//                 res = { data: rows, success: true };
//                 rowsData = rows;
//                 resolve(rows);
//             });
//             //db.close();
//         } catch (err) {
//             console.log('Error', err);
//             resolve(err);
//         }
//     })
//}

const viewDataName = async() => {
    const tableName = 'criminalDetails';
    //const query = `select * from ${tableName}`;
    const query = `select criminalDetails.name, locationDetails.state, locationDetails.city, criminalDetails.address, crimeData.category, crimeData.description, locationDetails.policestation, crimeData.incidentdate from criminalDetails JOIN locationDetails ON criminalDetails.state = locationDetails.state JOIN crimeData ON criminalDetails.id = crimeData.id`;
    
    let res;
    return new Promise((resolve, reject) => {
        try {
            console.log('query :', query);
            db.all(query, function (err, rows) {
                console.log('rows :', rows);
               // return false
                res = { data: rows, success: true };
                rowsData = rows;
                resolve(rows);
            });
            //db.close();
        } catch (err) {
            console.log('Error', err);
            resolve(err);
        }
    })
}


const viewDataLocation = async() => {
    const tableName = 'location';
    const query = `select * from ${tableName}`;
    let res;
    return new Promise((resolve, reject) => {
        try {
            console.log('query :', query);
            db.all(query, function (err, rows) {
                console.log('rows :', rows);
                res = { data: rows, success: true };
                rowsData = rows;
                resolve(rows);
            });
            //db.close();
        } catch (err) {
            console.log('Error', err);
            resolve(err);
        }
    })
}

const viewDataCrimeData = async() => {
    const tableName = 'crimedata';
    const query = `select * from ${tableName}`;
    let res;
    return new Promise((resolve, reject) => {
        try {
            console.log('query :', query);
            db.all(query, function (err, rows) {
                console.log('rows :', rows);
                res = { data: rows, success: true };
                rowsData = rows;
                resolve(rows);
            });
            //db.close();
        } catch (err) {
            console.log('Error', err);
            resolve(err);
        }
    })
}


