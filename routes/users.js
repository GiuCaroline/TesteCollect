// routes/users.js - CÓDIGO COMPLETO E CORRIGIDO

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * Rota de Login: POST /users/login
 */
router.post('/login', async (req, res) => {
  const { email, senha, tipo_usuario } = req.body;

  if (!email || !senha || !tipo_usuario) {
    return res.status(400).json({ message: 'Email, senha e tipo de usuário são obrigatórios.' });
  }

  try {
    const query = 'SELECT * FROM tb_usuarios WHERE email = $1 AND tipo_usuario = $2';
    const result = await db.query(query, [email, tipo_usuario]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas ou tipo de perfil incorreto.' });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas ou tipo de perfil incorreto.' });
    }

    req.session.user = {
      id: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo_usuario
    };

    const redirectUrl = '/index.html'; // Redireciona sempre para a página inicial

    res.status(200).json({ 
      success: true, 
      message: 'Login bem-sucedido!', 
      redirectUrl: redirectUrl 
    });

  } catch (error) {
    console.error('Erro no processamento do login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});


// Rota de Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Não foi possível fazer logout.');
        }
        res.redirect('/login.html');
    });
});

module.exports = router;