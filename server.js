//Creates the express server and sets its functions to app
const e = require('express');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//Imports sql functions
const mysql = require('mysql2');

const inputCheck = require('./utils/inputCheck');

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
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query (sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row,
        });
    });
});

//Get's all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });

//Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors});
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error:err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
        });
    });
});

//Updates a candidates party
app.put('/api/candidate/:id', (req, res) => {
    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ errors: errors });
        return;
    }
    const params = [req.body.party_id, req.params.id];

    db.query(sql,params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            //Check if record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

//BEGIN PARTY DB ROUTES
//----------------------

//Route to get all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//Route to get party by id
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//Route to delete a party
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            //Checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//Default response for any other request (Not Found) **NEEDS TO BE LAST**
app.use((req, res) => {
    res.status(404).end();
});

//Starts the server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});