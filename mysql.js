require('dotenv/config')
const mysql = require('mysql')

var pool = mysql.createPool({
    'user': process.env.PS_USERNAME,
    'password': process.env.PS_PASS,
    'database': process.env.PS_DATABASE,
    'host': process.env.PS_HOST,
    'port': 3306
})

exports.pool = pool