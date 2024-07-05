const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.HOST ||'localhost',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432
});
pool.on("connect", client => {
    client.on("notice", msg => console.log("notice", msg?.message));
});
module.exports = {
    query: (text, params) => pool.query(text, params),
};



