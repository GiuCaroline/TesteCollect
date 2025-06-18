// routes/cadastro.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/cadastrar', async (req, res) => {
  // --- Ponto de verificação 1: A rota foi acionada? ---
  console.log('LOG: Requisição recebida em POST /cadastrar.');

  // --- Ponto de verificação 2: O corpo da requisição (dados do formulário) chegou? ---
  console.log('LOG: Dados recebidos do formulário:', req.body);

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

  // Verifica se o middleware express.json() está a funcionar. Se req.body estiver vazio, o problema está no server.js.
  if (!req.body || Object.keys(req.body).length === 0) {
      console.error('ERRO: O corpo da requisição (req.body) está vazio. Verifique o middleware express.json().');
      return res.status(400).json({ success: false, message: 'Nenhum dado recebido no formulário.' });
  }

  if (!nome || !email || !senha || !tipo_usuario) {
    console.error('ERRO: Campos obrigatórios em falta.');
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos obrigatórios.' });
  }

  try {
    // --- Ponto de verificação 3: Entrou no bloco try. A verificar se o utilizador já existe. ---
    console.log(`LOG: A verificar no banco de dados se o e-mail "${email}" já existe.`);
    const userExists = await db.query('SELECT * FROM tb_usuarios WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      console.log('LOG: E-mail já existe. Retornando erro 409.');
      return res.status(409).json({ success: false, message: 'Este e-mail já está em uso.' });
    }

    // --- Ponto de verificação 4: E-mail não existe. A encriptar a senha. ---
    console.log('LOG: E-mail disponível. A encriptar a senha...');
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    console.log('LOG: Senha encriptada com sucesso.');

    // --- Ponto de verificação 5: A preparar para inserir o novo utilizador no banco. ---
    console.log('LOG: A montar a query de inserção.');
    const insertQuery = `
      INSERT INTO tb_usuarios(nome, email, senha, telefone, endereco, tipo_usuario, cpf, nome_empresa, cnpj)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id_usuario, nome, email, tipo_usuario;
    `;
    const values = [
      nome, email, senhaHash, telefone, endereco, tipo_usuario,
      tipo_usuario === 'cliente' ? cpf : null,
      tipo_usuario === 'cacambeiro' ? nome_empresa : null,
      tipo_usuario === 'cacambeiro' ? cnpj : null,
    ];
    console.log('LOG: Query pronta. A executar a inserção no banco de dados...');
    
    // --- Ponto de verificação 6: Executando a query. ---
    const result = await db.query(insertQuery, values);
    const novoUsuario = result.rows[0];
    console.log('LOG: Utilizador inserido com sucesso! ID:', novoUsuario.id_usuario);

    // --- Ponto de verificação 7: Criando a sessão. ---
    console.log('LOG: A criar a sessão para o utilizador.');
    req.session.user = {
      id: novoUsuario.id_usuario,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      tipo: novoUsuario.tipo_usuario
    };

    console.log('LOG: Sessão criada. Enviando resposta de sucesso.');
    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      user: req.session.user
    });

  } catch (error) {
    // --- Ponto de verificação 8: Ocorreu um erro no bloco try! ---
    console.error('ERRO DETALHADO NO BLOCO CATCH:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor. Tente novamente.' });
  }
});

module.exports = router;