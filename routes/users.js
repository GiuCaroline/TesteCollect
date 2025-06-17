const express = require('express');
const router = express.Router();
const db = require('../db');
const md5 = require('md5');

// ROTA DE CADASTRO (substitui cadastrar_cliente.html)
// POST /api/users/register
router.post('/register', async (req, res) => {
    const { nome, cpf, cep, numcasa, telefone, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const senha_cripto = md5(senha);

    try {
        const userExists = await db.query('SELECT id_cliente FROM tb_cliente WHERE email_cliente = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Este e-mail já está em uso.' });
        }

        const insertQuery = 'INSERT INTO tb_cliente (nome_cliente, cpf_cliente, cep_cliente, num_casa_cliente, telefone_cliente, email_cliente, senha_cliente) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_cliente';
        const result = await db.query(insertQuery, [nome, cpf, cep, numcasa, telefone, email, senha_cripto]);
        
        // Inicia a sessão para o usuário recém-cadastrado
        req.session.userId = result.rows[0].id_cliente;
        req.session.userType = 'cliente';

        res.status(201).json({ message: 'Cadastro realizado com sucesso!', redirectUrl: '/servicos' });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// ROTA DE LOGIN (substitui logincliente.html e logincacambeiro.html)
// POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, senha, userType } = req.body; // userType pode ser 'cliente' ou 'cacambeiro'
    const senha_cripto = md5(senha);

    let query;
    if (userType === 'cliente') {
        query = 'SELECT id_cliente, nome_cliente FROM tb_cliente WHERE email_cliente = $1 AND senha_cliente = $2';
    } else if (userType === 'cacambeiro') {
        query = 'SELECT id_cacambeiro, nome_cacambeiro FROM tb_cacambeiro WHERE email_cacambeiro = $1 AND senha_cacambeiro = $2';
    } else {
        return res.status(400).json({ message: 'Tipo de usuário inválido.' });
    }

    try {
        const result = await db.query(query, [email, senha_cripto]);

        if (result.rows.length > 0) {
            // Login bem-sucedido, armazena na sessão
            req.session.userId = (userType === 'cliente') ? result.rows[0].id_cliente : result.rows[0].id_cacambeiro;
            req.session.userType = userType;
            req.session.userName = (userType === 'cliente') ? result.rows[0].nome_cliente : result.rows[0].nome_cacambeiro;
            
            res.json({ message: 'Login bem-sucedido!', redirectUrl: '/servicos' });
        } else {
            res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// ROTA DE LOGOUT (substitui logout.html)
// GET /api/users/logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Não foi possível fazer logout.' });
        }
        // Limpa o cookie no lado do cliente e redireciona
        res.clearCookie('connect.sid'); // 'connect.sid' é o nome padrão do cookie de sessão do Express
        res.json({ message: 'Logout bem-sucedido', redirectUrl: '/login' });
    });
});

// ROTA PARA VERIFICAR STATUS DA SESSÃO (útil para o frontend)
// GET /api/users/status
router.get('/status', (req, res) => {
    if (req.session.userId) {
        res.json({
            loggedIn: true,
            userId: req.session.userId,
            userType: req.session.userType,
            userName: req.session.userName
        });
    } else {
        res.json({ loggedIn: false });
    }
});


module.exports = router;