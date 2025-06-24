// db.js - VERSÃO CORRIGIDA

const { Pool } = require('pg');
require('dotenv').config();

// Pegamos a string de conexão completa da sua variável de ambiente no Render
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  // A connectionString continua aqui, com a sua senha
  connectionString,

  // A configuração de SSL é importante para o Render/Supabase
  ssl: {
    rejectUnauthorized: false
  },

  // ---- LINHA ADICIONADA ----
  // Esta linha força a conexão a usar o endereço correto (IPv4)
  host: 'db.pgrwhhznlmdqaiwykvwr.supabase.co'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};