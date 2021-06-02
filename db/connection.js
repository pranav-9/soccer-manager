const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config();

const connectionString = process.env.DB_CONNECT_POSTGRESQL;
console.log(connectionString);
let pool = new Pool ( {
    connectionString
    });

module.exports = pool;