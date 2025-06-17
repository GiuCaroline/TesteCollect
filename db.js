// Importa o driver do PostgreSQL
const { Pool } = require('pg');

// Configura a conexão com o banco de dados
// (Lembre-se de usar variáveis de ambiente quando for hospedar!)
const pool = new Pool({
    user: 'postgres', // Usuário do seu banco Supabase/local
    host: 'db.pgrwhhznlmdqaiwykvwr.supabase.co', // Host do seu banco Supabase/local
    database: 'postgres', // Nome do banco
    password: '#j00S84*@U=1', // Senha do seu banco Supabase/local
    port: 5432, // Porta padrão do PostgreSQL
});

// Exporta o objeto 'pool' para que outros arquivos possam usá-lo para fazer queries
module.exports = {
    query: (text, params) => pool.query(text, params),
};