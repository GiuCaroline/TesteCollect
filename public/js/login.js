// Local do arquivo: public/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    // 1. Previne o comportamento padrão do formulário, que é recarregar a página.
    // Isso é crucial para que o nosso script possa controlar o que acontece em seguida.
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('error-message');

    // Limpa mensagens de erro anteriores
    mensagemErro.style.display = 'none';
    mensagemErro.textContent = '';

    try {
        // 2. Envia os dados de login para a nossa API no backend.
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const result = await response.json();

        // 3. Verifica se a resposta do servidor foi bem-sucedida (status 200-299).
        if (response.ok) {
            // Login bem-sucedido!
            
            // Guarda o token no localStorage para manter o usuário logado.
            localStorage.setItem('token', result.token);
            if (result.tipo_usuario) {
                localStorage.setItem('tipo_usuario', result.tipo_usuario);
            }

            // --- ALTERAÇÃO PRINCIPAL AQUI ---
            // Redireciona o usuário para a página principal (index.html).
            window.location.href = '/index.html'; 

        } else {
            // Se o login falhar (credenciais erradas, etc.), exibe a mensagem de erro do servidor.
            mensagemErro.textContent = result.message || 'Erro ao fazer login.';
            mensagemErro.style.display = 'block';
        }
    } catch (error) {
        // Se houver um erro de rede ou o servidor não responder.
        console.error('Erro na requisição de login:', error);
        mensagemErro.textContent = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        mensagemErro.style.display = 'block';
    }
});