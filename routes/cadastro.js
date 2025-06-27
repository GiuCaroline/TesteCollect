const express = require('express');
const router = express.Router();
const {
    createClient
} = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Configuração do cliente Supabase
// Certifique-se de que as suas variáveis de ambiente estão corretas no Render.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
    const {
        nome,
        email,
        senha,
        userType
    } = req.body;

    // Validação básica dos dados recebidos
    if (!nome || !email || !senha || !userType) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios.'
        });
    }

    try {
        // Criptografar a senha antes de salvar
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Inserir o novo usuário na tabela 'usuarios' do Supabase
        const {
            data,
            error
        } = await supabase
            .from('tb_usuarios') 
            .insert([{
                nome: nome,
                email: email,
                senha: hashedPassword,
                tipo_usuario: userType
            }])
            .select();

        if (error) {
            console.error('Erro ao cadastrar usuário no Supabase:', error);
            // Verifica se é um erro de violação de unicidade (email já existe)
            if (error.code === '23505') {
                return res.status(409).json({
                    error: 'O e-mail informado já está em uso.'
                });
            }
            return res.status(500).json({
                error: 'Erro interno ao cadastrar usuário.'
            });
        }

        console.log('Usuário cadastrado com sucesso:', data);
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user: data[0]
        });

    } catch (error) {
        console.error('Erro no servidor ao tentar cadastrar:', error);
        res.status(500).json({
            error: 'Ocorreu um erro inesperado no servidor.'
        });
    }
});

module.exports = router;