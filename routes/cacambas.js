const express = require('express');
const router = express.Router();
const db = require('../db'); // Nossa conexão

// Rota para listar todas as caçambas disponíveis (GET /cacambas)
router.get('/', async (req, res) => {
    try {
        // A consulta busca caçambas com status diferente de 1 (não alugada)
        const query = 'SELECT * FROM tb_cacambas WHERE status_cacamba != 1';
        const result = await db.query(query);

        // Retorna os resultados como JSON
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar caçambas:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Adicione aqui outras rotas (cadastrar, editar, deletar caçamba)

module.exports = router;