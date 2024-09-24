const {Pool} = require('pg');

const config = {
    user: "postgres",
    host: "localhost",
    password: "hieunt04lm",
    port: 5432,
    database: "myFirstDb"
};

const pool = new Pool(config);
module.exports = pool;