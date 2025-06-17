// TesteCollect-main/routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Garante que a conexão com o banco de dados está correta
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * ======================================================
 * ROTA DE REGISTRO
 * As páginas de cadastro podem continuar separadas, mas
 * ambas salvarão os dados na mesma tabela 'usuarios'.
 * ======================================================
 */

// Rota para registrar um novo cliente
router.post('/register/cliente', async (req, res) => {
    const { nome, email, senha, telefone, endereco, cpf } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        const newUser = await db.query(
            "INSERT INTO public.tb_usuarios (nome, email, senha, telefone, endereco, cpf, tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6, 'cliente') RETURNING *",
            [nome, email, hashedPassword, telefone, endereco, cpf]
        );
        res.status(201).json({ message: "Cliente registrado com sucesso!", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no servidor ao registrar cliente.");
    }
});

// Rota para registrar um novo cacambeiro
router.post('/register/cacambeiro', async (req, res) => {
    const { nome, email, senha, telefone, endereco, nome_empresa, cnpj, horario_atendimento } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        const newUser = await db.query(
            "INSERT INTO public.tb_usuarios (nome, email, senha, telefone, endereco, nome_empresa, cnpj, tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, 'cacambeiro') RETURNING *",
            [nome, email, hashedPassword, telefone, endereco, nome_empresa, cnpj]
        );
        res.status(201).json({ message: "Cacambeiro registrado com sucesso!", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no servidor ao registrar cacambeiro.");
    }
});


/**
 * ======================================================
 * ROTA DE LOGIN UNIFICADA
 * Esta é a nova rota de login que sua página única usará.
 * ======================================================
 */
router.post('/login', async (req, res) => {
    const { email, senha, tipo_usuario } = req.body; // Recebe o tipo de usuário do formulário

    // Validação simples
    if (!email || !senha || !tipo_usuario) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    try {
        // Busca o usuário pelo email E pelo tipo de usuário
        const userResult = await db.query("SELECT * FROM usuarios WHERE email = $1 AND tipo_usuario = $2", [email, tipo_usuario]);

        if (userResult.rows.length === 0) {
            // Se não encontrar, retorna erro
            return res.status(401).json({ message: "Credenciais inválidas ou tipo de usuário incorreto." });
        }

        const user = userResult.rows[0];

        // Compara a senha enviada com a senha criptografada no banco
        const validPassword = await bcrypt.compare(senha, user.senha);

        if (!validPassword) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // Se a senha estiver correta, cria a sessão
        req.session.user = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo_usuario
        };

        // Redireciona para a página de perfil correta com base no tipo
        const redirectUrl = user.tipo_usuario === 'cliente' ? '/ccliente.html' : '/ccacamba.html';
        
        res.status(200).json({ message: "Login bem-sucedido!", redirectUrl });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no servidor durante o login.");
    }
});

/**
 * ======================================================
 * ROTA DE LOGOUT
 * ======================================================
 */
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Não foi possível fazer logout.");
        }
        res.redirect('/login.html');
    });
});

module.exports = router;