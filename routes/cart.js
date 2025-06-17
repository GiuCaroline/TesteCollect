const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware para garantir que o carrinho exista na sessão
router.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = []; // Se não existir, cria um carrinho vazio
    }
    next();
});

// ROTA PARA OBTER O CARRINHO (substitui a lógica de exibição em carrinho.html)
// GET /api/cart
router.get('/', async (req, res) => {
    const cartIds = req.session.cart.map(item => item.id);
    if (cartIds.length === 0) {
        return res.json([]); // Retorna um array vazio se o carrinho estiver vazio
    }

    try {
        const query = `SELECT id_cacamba, nome_empresa, tipo_cacamba, capacidade_cacamba, preco_aluguel_cacamba, imagem_cacamba FROM tb_cacambas WHERE id_cacamba = ANY($1::int[])`;
        const result = await db.query(query, [cartIds]);
        
        // Adiciona a quantidade de cada item
        const cartItems = result.rows.map(item => {
            const cartItem = req.session.cart.find(ci => ci.id === item.id_cacamba);
            return { ...item, quantity: cartItem.quantity };
        });

        res.json(cartItems);
    } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// ROTA PARA ADICIONAR AO CARRINHO (substitui adicionar_ao_carrinho.html)
// POST /api/cart/add
router.post('/add', (req, res) => {
    const { cacambaId, quantity } = req.body;
    const id = parseInt(cacambaId);
    const qty = parseInt(quantity) || 1;

    if (!id) {
        return res.status(400).json({ message: 'ID da caçamba é inválido.'});
    }

    const existingItemIndex = req.session.cart.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
        // Se o item já existe, apenas incrementa a quantidade (opcional)
        // req.session.cart[existingItemIndex].quantity += qty;
        return res.status(409).json({ message: 'Item já está no carrinho.'});

    } else {
        req.session.cart.push({ id: id, quantity: qty });
    }
    
    res.status(200).json({ message: 'Item adicionado ao carrinho!', cart: req.session.cart });
});

// ROTA PARA REMOVER DO CARRINHO (substitui remover_carrinho.html)
// POST /api/cart/remove
router.post('/remove', (req, res) => {
    const { cacambaId } = req.body;
    const id = parseInt(cacambaId);

    req.session.cart = req.session.cart.filter(item => item.id !== id);

    res.status(200).json({ message: 'Item removido do carrinho!', cart: req.session.cart });
});


module.exports = router;