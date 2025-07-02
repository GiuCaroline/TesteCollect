// routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../db'); 
const bcrypt = require('bcrypt');

// Rota de Login (Não alterada, apenas para contexto)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        // Usando a instância 'pool' exportada de db.js
        const result = await db.query('SELECT * FROM tb_usuario WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const user = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // Sessão é criada com os dados do usuário
        req.session.usuario = {
            id: user.id_usuario,
            nome: user.nome,
            email: user.email,
            tipo_usuario: user.tipo_usuario
        };

        console.log('Sessão criada para:', req.session.usuario);

        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                id: user.id_usuario,
                nome: user.nome,
                email: user.email,
                tipo_usuario: user.tipo_usuario
            }
        });

    } catch (error) {
        console.error('Erro no servidor ao tentar fazer login:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// --- ROTA DE SESSÃO CORRIGIDA ---
/*
 * Documentação:
 * Rota: GET /users/api/session-info
 * O frontend (auth.js) chama esta rota para verificar se há um usuário logado.
 * Se `req.session.usuario` existir, devolvemos os dados no formato que o frontend espera.
*/
router.get('/api/session-info', (req, res) => {
    if (req.session.usuario) {
        // Usuário está logado, enviamos os dados com a flag 'loggedIn: true'
        res.json({
            loggedIn: true,
            usuario: req.session.usuario // Enviando o objeto de usuário completo
        });
    } else {
        // Ninguém logado
        res.json({
            loggedIn: false
        });
    }
});


// --- ROTA DE LOGOUT CORRIGIDA ---
/*
 * Documentação:
 * Rota: GET /users/logout
 * O link "Sair" aponta para esta rota.
 * Ela destrói a sessão e redireciona para a página de login.
*/
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).send('Não foi possível fazer logout.');
        }

        // Limpa o cookie do navegador e redireciona
        res.clearCookie('connect.sid'); 
        res.redirect('/login.html'); 
    });
});

module.exports = router;