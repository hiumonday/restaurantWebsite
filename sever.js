const express = require('express');
const path = require('path');
const pool = require('./connection.js');
const route = require('./routes/siteRouters.js');


const app = express();
const port = 5500


app.use(express.urlencoded({ extended: true }));
// Parse JSON request bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'view')));


route(app);


app.listen(port, () => {
    console.log(`demo1 app is listening on port http://localhost:${port}`)
})