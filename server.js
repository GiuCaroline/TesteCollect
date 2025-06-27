// Local do arquivo: server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { Pool } = require('pg'); // Importa o Pool do driver 'pg'
const pgSession = require('connect-pg-simple')(session); // Importa e inicializa o connect-pg-simple

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Rotas da aplicação
const usersRoutes = require('./routes/users');
const cacambasRoutes = require('./routes/cacambas');
const cadastroRoutes = require('./routes/cadastro');
const cartRoutes = require('./routes/cart');

const app = express();
const port = process.env.PORT || 3000;

// Cria um Pool de conexões com o banco de dados usando a URL do .env
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necessário para conexões com o Supabase/Render
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// =========================================================================
// NOVA CONFIGURAÇÃO DE SESSÃO
// Agora, as sessões serão armazenadas no banco de dados.
app.use(session({
    // Configura o armazenamento da sessão para usar o banco de dados
    store: new pgSession({
        pool: pgPool, // Usa o pool de conexões que criamos
        createTableIfMissing: true, // Cria a tabela 'session' automaticamente se não existir
    }),
    // O secret é usado para assinar o ID da sessão.
    secret: process.env.SESSION_SECRET,
    resave: false, // Não salva a sessão se não for modificada
    saveUninitialized: false, // Não cria sessão até que algo seja armazenado
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // A sessão expira em 30 dias
        secure: process.env.NODE_ENV === 'production', // 'true' em produção (HTTPS)
        httpOnly: true // Previne acesso ao cookie via JavaScript no cliente
    }
}));
// =========================================================================

// Rotas
app.use('/users', usersRoutes);
app.use('/cacambas', cacambasRoutes);
app.use('/cadastro', cadastroRoutes);
app.use('/cart', cartRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});