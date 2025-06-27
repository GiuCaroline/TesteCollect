// Local do arquivo: public/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('error-message');

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const result = await response.json();

        if (response.ok) {
            // Se o login for bem-sucedido, armazena o token e o tipo de usuário
            localStorage.setItem('token', result.token);
            localStorage.setItem('tipo_usuario', result.tipo_usuario);

            // Redireciona com base no tipo de usuário
            if (result.tipo_usuario === 'cliente') {
                window.location.href = '/perfilcliente.html';
            } else if (result.tipo_usuario === 'cacambeiro') {
                window.location.href = '/perfilcacambeiro.html';
            } else {
                 // Fallback para uma página padrão, caso o tipo não seja reconhecido
                window.location.href = '/';
            }
        } else {
            // Exibe a mensagem de erro retornada pelo servidor
            mensagemErro.textContent = result.message || 'Erro ao fazer login.';
            mensagemErro.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro na requisição de login:', error);
        mensagemErro.textContent = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        mensagemErro.style.display = 'block';
    }
});