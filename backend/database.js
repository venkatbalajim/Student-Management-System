const mysql2 = require("mysql2")
const dotenv = require("dotenv")

dotenv.config()

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
})

module.exports = pool.promise()
