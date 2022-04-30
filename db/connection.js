//Imports sql functions
const mysql = require('mysql2');

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

module.exports = db;