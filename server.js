//Creates the express server and sets its functions to app
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//Imports sql functions
const mysql = require('mysql2');

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connects  to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password:'Meshuganah251$',
        database: 'election', 
    },
    console.log('Connected to the election database.')
);

//Gets a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

//Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

//Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
            VALUES (?,?,?,?)`;

const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

//Default response for any other request (Not Found) **NEEDS TO BE LAST**
app.use((req, res) => {
    res.status(404).end();
});

//Starts the server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});