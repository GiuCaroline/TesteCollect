// public/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('error-message');

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login bem-sucedido!
            console.log(data.message);
            mensagemErro.style.display = 'none'; // Esconde mensagens de erro antigas

            // Redireciona o usuário para a página de perfil correta.
            // Usamos a informação 'user.tipo_usuario' que o backend nos enviou.
            if (data.user.tipo_usuario === 'cacambeiro') {
                window.location.href = '/index.html';
            } else {
                window.location.href = '/index.html';
            }
        } else {
            // Mostra a mensagem de erro retornada pela API
            mensagemErro.textContent = data.error || 'Ocorreu um erro.';
            mensagemErro.style.display = 'block';
        }
    } catch (error) {
        // Erro de rede ou algo que impediu a comunicação com o servidor
        console.error('Erro ao tentar fazer login:', error);
        mensagemErro.textContent = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
        mensagemErro.style.display = 'block';
    }
});