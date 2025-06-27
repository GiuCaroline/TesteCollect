// routes/users.js - SUBSTITUA A ROTA DE LOGIN POR ESTA

router.post('/login', async (req, res) => {
    const { email, senha, tipo_usuario } = req.body;

    if (!email || !senha || !tipo_usuario) {
        return res.status(400).json({ message: 'Email, senha e tipo de usuário são obrigatórios.' });
    }

    try {
        // CORREÇÃO: Usando o nome correto da tabela -> "tb_usuarios"
        const userResult = await db.query("SELECT * FROM tb_usuarios WHERE email = $1 AND tipo_usuario = $2", [email, tipo_usuario]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas ou tipo de perfil incorreto." });
        }

        const user = userResult.rows[0];

        const validPassword = await bcrypt.compare(senha, user.senha);

        if (!validPassword) {
            return res.status(401).json({ message: "Credenciais inválidas ou tipo de perfil incorreto." });
        }

        // CORREÇÃO: Usando a coluna correta do ID -> "id_usuario"
        req.session.user = {
            id: user.id_usuario,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo_usuario
        };

        const redirectUrl = '/index.html';
        
        res.status(200).json({ message: "Login bem-sucedido!", redirectUrl });

    } catch (err) {
        // Dica de melhoria: logar o erro completo (err) em vez de apenas a mensagem (err.message)
        console.error("Erro no servidor durante o login:", err); 
        res.status(500).send("Erro no servidor durante o login.");
    }
});

// Certifique-se de que a rota de logout e o module.exports continuam no ficheiro
// router.get('/logout', ...);
// module.exports = router;