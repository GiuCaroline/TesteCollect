//ADICIONA COISAS EM PÁGINA DE SERVICOS

document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const servicosList = document.getElementById('servicosList');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(cadastroForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Cadastro:', data);
            alert('Cadastro realizado com sucesso!');
            cadastroForm.reset();
        });
    }

    if (servicosList) {
        const servicos = [
            { nome: 'Remoção de Entulho', localizacao: 'São Paulo', preco: 'R$ 200' },
            { nome: 'Remoção de Resíduos', localizacao: 'Rio de Janeiro', preco: 'R$ 250' },
        ];

        servicos.forEach(servico => {
            const servicoItem = document.createElement('div');
            servicoItem.classList.add('servico-item');
            servicoItem.innerHTML = `
                <h3>${servico.nome}</h3><p>Localização: ${servico.localizacao}</p><p>Preço: ${servico.preco}</p>
            `;
            servicosList.appendChild(servicoItem);
        });
    }
});

