// routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão com o banco
const bcrypt = require('bcrypt'); // Importa o bcrypt para comparar senhas

// ... (Pode haver outras rotas aqui, como a de logout)

/**
 * Rota de Login: POST /users/login
 * Recebe: email, senha, tipo_usuario
 * Verifica as credenciais e cria uma sessão se forem válidas.
 */
router.post('/login', async (req, res) => {
  // 1. Extrai os dados do corpo da requisição
  const { email, senha, tipo_usuario } = req.body;

  // Validação básica
  if (!email || !senha || !tipo_usuario) {
    return res.status(400).json({ message: 'Email, senha e tipo de usuário são obrigatórios.' });
  }

  try {
    // 2. Procura o utilizador no banco de dados pelo email E pelo tipo de usuário
    const query = 'SELECT * FROM tb_usuarios WHERE email = $1 AND tipo_usuario = $2';
    const result = await db.query(query, [email, tipo_usuario]);

    // Se a busca não retornar nenhum utilizador
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado ou tipo de perfil incorreto.' });
    }

    const user = result.rows[0];

    // 3. Compara a senha enviada com a senha armazenada no banco
    // A função bcrypt.compare faz isso de forma segura.
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      // Se as senhas não baterem
      return res.status(401).json({ message: 'Senha inválida.' });
    }

    // 4. Se tudo estiver correto, cria a sessão do utilizador
    req.session.user = {
      id: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo_usuario
    };
    // 5. Define para qual página o utilizador será redirecionado
    const redirectUrl = '/index.html'; // Redireciona sempre para a página inicial

    // 6. Envia a resposta de sucesso para o frontend
    res.status(200).json({ 
      success: true, 
      message: 'Login bem-sucedido!', 
      redirectUrl: redirectUrl 
    });

  } catch (error) {
    console.error('Erro no login:', error);
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