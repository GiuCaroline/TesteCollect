// db.js

const { Pool } = require('pg');
// require('dotenv').config(); // LINHA REMOVIDA OU COMENTADA

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    host: 'db.pgrwhhznlmdqaiwykvwr.supabase.co' // Não se esqueça de preencher isto!
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};