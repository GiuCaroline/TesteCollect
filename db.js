// giucaroline/testecollect/TesteCollect-ac0ff62df68945aabb0a221394b3e0b82886ce14/db.js

const { Pool } = require('pg');
require('dotenv').config();

// 1. Analisa a connection string para obter as partes individuais.
const connectionString = process.env.DATABASE_URL;
const dbUrl = new URL(connectionString);

const dbUser = dbUrl.username;
const dbPassword = dbUrl.password;
const dbHost = dbUrl.hostname;
const dbPort = dbUrl.port;
const dbName = dbUrl.pathname.slice(1);

// 2. Cria o objeto de configuração do pool.
//    A principal mudança é que vamos modificar o host se ele for o padrão do Supabase.
const poolConfig = {
  user: dbUser,
  password: dbPassword,
  host: `aws-0-sa-east-1.pooler.supabase.com`,
  port: dbPort,
  database: dbName,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(poolConfig);

// Adiciona um listener para o evento de erro no pool para facilitar a depuração.
pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool ocioso', err);
  process.exit(-1);
});

module.exports = pool;