// routes/cadastro.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a sua conexão com o banco de dados
const bcrypt = require('bcrypt');

// Rota POST para /cadastrar
router.post('/cadastrar', async (req, res) => {
  // Extrai os dados do corpo da requisição (enviados pelo formulário)
  const {
    nome,
    email,
    senha,
    telefone,
    endereco,
    tipo_usuario,
    cpf,
    nome_empresa,
    cnpj
  } = req.body;

  // Verifica se todos os campos essenciais foram enviados
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos obrigatórios.' });
  }

  try {
    // 1. Verificar se o e-mail já existe no banco de dados
    const userExists = await db.query('SELECT * FROM tb_usuarios WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      // Se o e-mail já existe, retorna um erro
      return res.status(409).json({ success: false, message: 'Este e-mail já está em uso.' });
    }

    // 2. Criptografar a senha com bcrypt
    // O '10' é o "custo" do hash, um valor padrão e seguro.
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Montar a query de inserção
    const insertQuery = `
      INSERT INTO tb_usuarios(nome, email, senha, telefone, endereco, tipo_usuario, cpf, nome_empresa, cnpj)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id_usuario, nome, email, tipo_usuario;
    `;

    // Define os valores, usando null para campos que podem não existir dependendo do tipo de usuário
    const values = [
      nome,
      email,
      senhaHash,
      telefone,
      endereco,
      tipo_usuario,
      tipo_usuario === 'cliente' ? cpf : null,
      tipo_usuario === 'cacambeiro' ? nome_empresa : null,
      tipo_usuario === 'cacambeiro' ? cnpj : null,
    ];

    // 4. Executar a query para inserir o novo usuário
    const result = await db.query(insertQuery, values);
    const novoUsuario = result.rows[0];

    // 5. Se o cadastro for bem-sucedido, criar a sessão do usuário
    req.session.user = {
      id: novoUsuario.id_usuario,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      tipo: novoUsuario.tipo_usuario
    };

    // 6. Enviar uma resposta de sucesso para o frontend
    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      user: req.session.user
    });

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor. Tente novamente.' });
  }
});

module.exports = router;