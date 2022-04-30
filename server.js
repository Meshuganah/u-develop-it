//Creates the express server and sets its functions to app
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const inputCheck = require('./utils/inputCheck');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Use api routes
app.use('/api', apiRoutes);



//Default response for any other request (Not Found) **NEEDS TO BE LAST**
app.use((req, res) => {
    res.status(404).end();
});

//Starts the server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});