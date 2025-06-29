// db.js
require('dotenv').config();
const {
    createClient
} = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;