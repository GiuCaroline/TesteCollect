// Local do arquivo: db.js

// Importa a função para criar o cliente do Supabase
const { createClient } = require('@supabase/supabase-js');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Pega a URL e a Chave Anon (pública) das variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validação para garantir que as variáveis foram carregadas
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e Anon Key são obrigatórias. Verifique seu arquivo .env');
}

// Cria o cliente de conexão do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta o cliente para que outros arquivos (como users.js) possam usá-lo
module.exports = supabase;