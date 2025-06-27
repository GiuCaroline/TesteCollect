const express = require('express');
const router = express.Router();
const {
    createClient
} = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/login', async (req, res) => {
    const {
        email,
        senha
    } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            error: 'E-mail e senha são obrigatórios.'
        });
    }

    try {
        // 1. Encontrar o usuário pelo e-mail no banco de dados
        const {
            data: users,
            error
        } = await supabase
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

        // 2. Comparar a senha fornecida com a senha criptografada no banco
        const passwordMatch = await bcrypt.compare(senha, user.senha);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        // Se o login for bem-sucedido, pode-se criar uma sessão aqui
        // (ex: usando express-session) e redirecionar o usuário.
        // Por agora, vamos apenas retornar uma mensagem de sucesso.

        console.log('Login bem-sucedido para:', user.email);
        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: { // Não retorne a senha!
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


module.exports = router;