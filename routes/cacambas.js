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
// Adicione esta rota ao seu arquivo routes/cacambas.js

// GET /cacambas/com-empresa - Rota para buscar todas as caçambas com o nome da empresa associada
router.get('/com-empresa', async (req, res) => {
    try {
        // Exatamente a sua consulta SQL!
        const query = `
            SELECT
                c.id,
                c.tamanho,
                c.status,
                c.preco,
                c.localizacao,
                u.nome_empresa 
            FROM
                tb_cacambas AS c
            JOIN
                tb_usuarios AS u ON c.cacambeiro_id = u.id
            WHERE
                u.tipo_usuario = 'cacambeiro';
        `;

        const { rows } = await db.query(query);
        
        // Retorna a lista de caçambas com os dados da empresa como JSON
        res.status(200).json(rows);

    } catch (err) {
        console.error('Erro ao buscar caçambas com dados da empresa:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;