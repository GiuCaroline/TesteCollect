const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// --- Middlewares Essenciais ---
app.use(express.json()); // Para entender requisições com corpo em JSON
app.use(express.urlencoded({ extended: true })); // Para entender formulários HTML
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos (CSS, JS, Imagens)

// --- Configuração da Sessão ---
app.use(session({
    secret: ',YSF(lc{;209snG#Yc^9(>BLoE97a@51r0l%NzF:<"T*I1Z>=-',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Em produção (com HTTPS), mude para true
        httpOnly: true, // Ajuda a proteger contra ataques XSS
        maxAge: 1000 * 60 * 60 * 24 // Duração do cookie (ex: 24 horas)
    }
}));

// --- Rotas da Aplicação ---
// Carregamos os arquivos de rotas que vamos criar
const cadastroRouter = require('./routes/cadastro');
const userRoutes = require('./routes/users');
const cacambaRoutes = require('./routes/cacambas');
const cartRoutes =require('./routes/cart');

// Associamos as rotas a um caminho base
app.use('/api/users', userRoutes);       // Ex: /api/users/login
app.use('/api/cacambas', cacambaRoutes); // Ex: /api/cacambas/
app.use('/api/cart', cartRoutes);     // Ex: /api/cart/add
app.use('/', cadastroRouter);       // Ex: /api/cadastro

// --- Rotas para servir as páginas HTML ---
// Em vez de o usuário acessar /index.html, ele acessará /
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/cadastro', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cadastro.html')));
app.get('/servicos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cacambas.html')));
app.get('/carrinho', (req, res) => res.sendFile(path.join(__dirname, 'public', 'carrinho.html')));

// --- Iniciar o Servidor ---
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});