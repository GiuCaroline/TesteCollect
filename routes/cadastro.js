const express = require('express');
const router = express.Router();
const supabase = require('../db'); // Importa a conexão
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const {
        nome,
        email,
        senha,
        tipo_usuario
    } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios.'
        });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const {
            data,
            error
        } = await supabase
            .from('tb_usuarios')
            .insert([{
                nome: nome,
                email: email,
                senha: hashedPassword,
                tipo_usuario: tipo_usuario
            }])
            .select();

        if (error) {
            console.error('Erro ao cadastrar usuário no Supabase:', error);
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