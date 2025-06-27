// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries()); // Converte os dados do formulário para um objeto

            messageContainer.textContent = ''; // Limpa mensagens anteriores
            messageContainer.style.color = 'inherit';

            try {
                const response = await fetch('/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Se o login for bem-sucedido, redireciona para a página de perfil
                    messageContainer.style.color = 'green';
                    messageContainer.textContent = result.message;
                    
                    // Aguarda um instante para o utilizador ler a mensagem e depois redireciona
                    setTimeout(() => {
                        window.location.href = result.redirectUrl;
                    }, 1000); // 1 segundo de espera

                } else {
                    // Se houver erro, exibe a mensagem retornada pelo servidor
                    messageContainer.style.color = 'red';
                    messageContainer.textContent = result.message || 'Ocorreu um erro.';
                }
            } catch (error) {
                // Erro de rede ou conexão
                messageContainer.style.color = 'red';
                messageContainer.textContent = 'Erro de conexão. Tente novamente.';
                console.error('Erro no fetch:', error);
            }
        });
    }
});