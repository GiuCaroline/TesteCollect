// giucaroline/testecollect/TesteCollect-ac0ff62df68945aabb0a221394b3e0b82886ce14/db.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Adiciona um listener para o evento de erro no pool.
// Isso ajuda a capturar e exibir erros de conexão futuros.
pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool ocioso', err);
  process.exit(-1);
});

module.exports = pool;