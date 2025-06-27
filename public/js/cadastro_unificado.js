document.addEventListener('DOMContentLoaded', function() {
    const tipo_usuarioSelect = document.getElementById('tipo_usuario');
    const clienteFields = document.getElementById('clienteFields');
    const cacambeiroFields = document.getElementById('cacambeiroFields');
    const form = document.getElementById('cadastroForm');

    // Evento para mostrar/esconder campos com base na seleção
    tipo_usuarioSelect.addEventListener('change', function() {
        if (this.value === 'cliente') {
            clienteFields.style.display = 'block';
            cacambeiroFields.style.display = 'none';
        } else if (this.value === 'cacambeiro') {
            clienteFields.style.display = 'none';
            cacambeiroFields.style.display = 'block';
        } else {
            clienteFields.style.display = 'none';
            cacambeiroFields.style.display = 'none';
        }
    });

    // Evento de submissão do formulário
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Recolha dos dados do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const tipo_usuario = document.getElementById('tipo_usuario').value;

        // Cria o corpo da requisição com os dados comuns
        const requestBody = {
            nome,
            email,
            senha,
            tipo_usuario,
            cpf: null,
            nome_empresa: null,
            cnpj: null,
        };

        // Adiciona os dados específicos do tipo de usuário
        if (tipo_usuario === 'cliente') {
            requestBody.cpf = document.getElementById('cpf').value;
        } else if (tipo_usuario === 'cacambeiro') {
            requestBody.nome_empresa = document.getElementById('nome_empresa').value;
            requestBody.cnpj = document.getElementById('cnpj').value;
        }

        try {
            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = '/index.html';
            } else {
                alert('Erro: ' + result.error);
            }

        } catch (error) {
            console.error('Erro no fetch:', error);
            alert('Ocorreu um erro ao tentar realizar o cadastro.');
        }
    });
});