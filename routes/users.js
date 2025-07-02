// routes/users.js

const express = require('express');
const router = express.Router();
const supabase = require('../db'); // Sua conexão com o Supabase
const bcrypt = require('bcrypt');

// Rota de Login (sua lógica original com a adição da sessão)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            error: 'E-mail e senha são obrigatórios.'
        });
    }

    try {
        const { data: users, error } = await supabase
            .from('tb_usuarios')
            .select('*')
            .eq('email', email);

        if (error || !users || users.length === 0) {
            console.error('Erro ao buscar usuário ou usuário não encontrado:', error);
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(senha, user.senha);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        // Se a senha está correta, criamos a sessão para o usuário.
        // O `req.session` é fornecido pelo middleware `express-session` configurado no server.js
        req.session.usuario = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.user_type // Usando a coluna 'user_type' do seu banco
        };
        // <-- FIM DA NOVA SEÇÃO -->

        console.log('Login bem-sucedido para:', user.email);
        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo_usuario: user.user_type
            }
        });

    } catch (error) {
        console.error('Erro no servidor ao tentar fazer login:', error);
        res.status(500).json({
            error: 'Ocorreu um erro inesperado no servidor.'
        });
    }
});


// <-- NOVO: ROTA PARA VERIFICAR A SESSÃO -->
/*
 * Documentação:
 * Rota: GET /users/api/session-info
 * O frontend chamará esta rota para saber se há alguém logado.
 * Se `req.session.usuario` existir, devolvemos os dados do usuário.
 * Caso contrário, informamos que ninguém está logado.
*/
router.get('/api/session-info', (req, res) => {
    if (req.session.usuario) {
        // Usuário está logado, enviamos seus dados em um formato padronizado
        res.json({
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo_usuario: usuario.tipo

        });
    } else {
        // Ninguém logado
        res.json({
            loggedIn: false
        });
    }
});


// <-- NOVO: ROTA PARA LOGOUT -->
/*
 * Documentação:
 * Rota: GET /users/logout
 * O link/botão "Sair" do seu site deve apontar para cá.
 * A função `req.session.destroy` remove a sessão do banco de dados (da tabela 'session').
 * Depois, limpamos o cookie do navegador e redirecionamos para a página de login.
*/
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).send('Não foi possível fazer logout. Tente novamente.');
        }

        // 'connect.sid' é o nome padrão do cookie de sessão. Limpá-lo é uma boa prática.
        res.clearCookie('connect.sid'); 
        res.redirect('/login.html'); // Redireciona o usuário para a página de login
    });
});



module.exports = router;