// Local do arquivo: routes/users.js

const express = require('express');
const router = express.Router();
const supabase = require('../db'); // Importa a conexão com o Supabase
const bcrypt = require('bcrypt'); // Importa o bcrypt para comparar senhas
const jwt = require('jsonwebtoken'); // Importa o JWT para gerar tokens de autenticação

/**
 * @route   POST /users/login
 * @desc    Autentica um usuário e retorna um token JWT.
 * @access  Public
 */
router.post('/login', async (req, res) => {
    // 1. Extrai o email e a senha do corpo da requisição.
    const { email, senha } = req.body;

    // 2. Validação básica para garantir que os campos não estão vazios.
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        // 3. Busca no banco de dados por um usuário com o email fornecido.
        // Usamos .from('usuarios') para especificar a tabela.
        // Usamos .select('*') para pegar todas as colunas.
        // Usamos .eq('email', email) para filtrar pelo email.
        // .single() garante que esperamos apenas um resultado, ou um erro se não houver ou houver mais de um.
        const { data: usuario, error } = await supabase
            .from('tb_usuarios')
            .select('*')
            .eq('email', email)
            .single();

        // 4. Se o Supabase retornar um erro ou não encontrar o usuário, as credenciais são inválidas.
        if (error || !usuario) {
            console.log('Erro do Supabase ou usuário não encontrado:', error);
            return res.status(401).json({ message: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
        }

        // 5. Compara a senha enviada pelo usuário com a senha criptografada (hash) no banco.
        // A função bcrypt.compare faz isso de forma segura, sem expor a senha original.
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        // 6. Se a comparação de senhas falhar, as credenciais são inválidas.
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
        }

        // 7. Se as senhas correspondem, o login é bem-sucedido.
        // Geramos um token JWT que será usado para autenticar o usuário em futuras requisições.
        // ATENÇÃO: Crie um arquivo .env na raiz do projeto e adicione a variável JWT_SECRET=seu_segredo_super_secreto
        const token = jwt.sign(
            { id: usuario.id_usuario, tipo_usuario: usuario.tipo_usuario },
            process.env.JWT_SECRET || 'fallback_secret_key', // Use uma variável de ambiente!
            { expiresIn: '1h' } // O token expira em 1 hora
        );

        // 8. Retorna uma resposta de sucesso para o frontend com o token e o tipo de usuário.
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token,
            tipo_usuario: usuario.tipo_usuario
        });

    } catch (err) {
        // Em caso de qualquer outro erro no servidor, loga o erro e retorna uma mensagem genérica.
        console.error('Erro inesperado no servidor durante o login:', err);
        res.status(500).json({ message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' });
    }
});

module.exports = router;