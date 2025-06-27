const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * ======================================================
 * ROTA DE LOGIN UNIFICADA
 * ======================================================
 */
router.post('/login', async (req, res) => {
    const { email, senha, tipo_usuario } = req.body;

    if (!email || !senha || !tipo_usuario) {
        return res.status(400).json({ message: 'Email, senha e tipo de usuário são obrigatórios.' });
    }

    try {
        // Usando o nome correto da tabela "tb_usuarios"
        const userResult = await db.query("SELECT * FROM tb_usuarios WHERE email = $1 AND tipo_usuario = $2", [email, tipo_usuario]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas ou tipo de perfil incorreto." });
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(senha, user.senha);

        if (!validPassword) {
            return res.status(401).json({ message: "Credenciais inválidas ou tipo de perfil incorreto." });
        }

        // Usando a coluna correta do ID "id_usuario"
        req.session.user = {
            id: user.id_usuario,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo_usuario
        };

        // Redirecionando para a página inicial, como solicitado
        const redirectUrl = '/index.html';
        
        res.status(200).json({ success: true, message: "Login bem-sucedido!", redirectUrl });

    } catch (err) {
        console.error("Erro no servidor durante o login:", err);
        res.status(500).json({ message: "Erro interno do servidor." });
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

// Não se esqueça de exportar o router no final!
module.exports = router;