
// Executa o código quando o HTML da página estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Pega os elementos do HTML que vamos manipular
    const tipoUsuarioSelect = document.getElementById('tipo_usuario');
    const camposClienteDiv = document.getElementById('campos-cliente');
    const camposCacambeiroDiv = document.getElementById('campos-cacambeiro');
    const form = document.getElementById('cadastro-form');
    const errorMessageDiv = document.getElementById('error-message');

    // Adiciona um "ouvinte" para o evento de mudança no seletor
    tipoUsuarioSelect.addEventListener('change', (event) => {
        const tipoSelecionado = event.target.value;

        // Esconde ambos os blocos de campos por padrão
        camposClienteDiv.style.display = 'none';
        camposCacambeiroDiv.style.display = 'none';

        if (tipoSelecionado === 'cliente') {
            // Se for cliente, mostra apenas os campos de cliente
            camposClienteDiv.style.display = 'block';
        } else if (tipoSelecionado === 'cacambeiro') {
            // Se for caçambeiro, mostra apenas os campos de caçambeiro
            camposCacambeiroDiv.style.display = 'block';
        }
    });

    // Adiciona um "ouvinte" para o evento de envio do formulário
    form.addEventListener('submit', async (event) => {
        // Previne o comportamento padrão do formulário (que recarregaria a página)
        event.preventDefault();
        errorMessageDiv.textContent = ''; // Limpa mensagens de erro antigas

        // Coleta os dados do formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Envia os dados para o servidor usando a API Fetch
            const response = await fetch('/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                // Se o backend retornar sucesso...
                alert('Cadastro realizado com sucesso!'); // Pop-up simples
                // Redireciona o usuário para a página inicial
                window.location.href = '/index.html';
            } else {
                // Se o backend retornar erro, mostra a mensagem
                errorMessageDiv.textContent = result.message || 'Ocorreu um erro.';
            }
        } catch (error) {
            console.error('Erro no fetch:', error);
            errorMessageDiv.textContent = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        }
    });
});