// Este é o "DNA" inicial de todo novo usuário
const starterPack = {
    groups: [
        { nome: 'Mercado' },
        { nome: 'Granel' },
        { nome: 'Farmácia' },
        { nome: 'Padaria' }
    ],
    categories: [
        { nome: 'Higiene', group: 'Mercado' },
        { nome: 'Limpeza', group: 'Mercado' },
        { nome: 'Frutas', group: 'Mercado' },
        { nome: 'Temperos', group: 'Granel' },
        { nome: 'Remédios', group: 'Farmácia' },
        { nome: 'Pães', group: 'Padaria' }
    ],
    products: [
        { nome: 'Detergente', categoria: 'Limpeza', group: 'Mercado' },
        { nome: 'Sabonete', categoria: 'Higiene', group: 'Mercado' },
        { nome: 'Banana', categoria: 'Frutas', group: 'Mercado' },
        { nome: 'Orégano', categoria: 'Temperos', group: 'Granel' },
        { nome: 'Dipirona', categoria: 'Remédios', group: 'Farmácia' },
        { nome: 'Pão Francês', categoria: 'Pães', group: 'Padaria' }
    ],
    // Itens que já aparecem na lista de compras logo de cara
    initialShoppingList: [
        { nome: 'Café', categoria: 'Grãos', grupo: 'Mercado', quantidade: 2 },
        { nome: 'Leite', categoria: 'Laticínios', grupo: 'Padaria', quantidade: 3 }
    ]
};

module.exports = starterPack;