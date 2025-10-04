const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'rootroot',
    database: 'pokemon_db',
    waitForConnections: true,
})

async function getConnection(){
    return pool.getConnection();
}

async function closePool(){
    await pool.end();
    console.log("El pool de conexiones se ha cerrado.");
}

module.exports = { getConnection, closePool }