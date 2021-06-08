const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config();

let connectionString = process.env.DB_CONNECT;
if (process.env.NODE_ENV === 'test') {
    connectionString = process.env.DB_CONNECT_TEST;
}

let pool = new Pool ( {
    connectionString
    });

module.exports = pool;