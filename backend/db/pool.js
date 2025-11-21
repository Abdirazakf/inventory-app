const {Pool} = require('pg')
require('dotenv').config()

module.exports = new Pool({
    connectionString: process.env.DB_STRING,
    ssl: {
        rejectUnauthorized: false,
        sslmode: 'require'
    },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000
})