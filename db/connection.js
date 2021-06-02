const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config();

const connectionString = process.env.DB_CONNECT_POSTGRESQL;

let pool = new Pool ( {
    connectionString
    });

module.exports = pool;