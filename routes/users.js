// routes/users.js

const express = require('express');
const router = express.Router();
const supabase = require('../db'); // Sua conexão, que é um cliente Supabase
const bcrypt = require('bcrypt');

// --- ROTA DE LOGIN CORRIGIDA ---
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        // **LÓGICA DE BUSCA RESTAURADA PARA A SINTAXE ORIGINAL DO SUPABASE**
        const { data: users, error } = await supabase
            .from('tb_usuario') // Corrigindo para o nome correto da tabela: tb_usuario
            .select('*')
            .eq('email', email);

        if (error || !users || users.length === 0) {
            console.error('Erro ao buscar usuário ou usuário não encontrado:', error);
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const user = users[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // **LÓGICA DE SESSÃO MANTIDA (ESSA PARTE ESTÁ CORRETA)**
        req.session.usuario = {
            id: user.id_usuario,
            nome: user.nome,
            email: user.email,
            tipo_usuario: user.tipo_usuario
        };

        console.log('Sessão criada para:', req.session.usuario);

        // Retorna a mensagem de sucesso e os dados do usuário
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


// Rota para verificar a sessão (não alterada, já está correta)
router.get('/api/session-info', (req, res) => {
    if (req.session.usuario) {
        res.json({
            loggedIn: true,
            usuario: req.session.usuario
        });
    } else {
        res.json({
            loggedIn: false
        });
    }
});


// Rota de logout (não alterada, já está correta)
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).send('Não foi possível fazer logout.');
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/login.html'); 
    });
});

module.exports = router;