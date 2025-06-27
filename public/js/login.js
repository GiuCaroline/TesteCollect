// Local do arquivo: public/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('error-message');

    // Limpa mensagens de erro anteriores
    mensagemErro.style.display = 'none';
    mensagemErro.textContent = '';

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
            // Login bem-sucedido!
            
            // Guarda o token e o tipo de usuário para manter o usuário logado
            localStorage.setItem('token', result.token);
            localStorage.setItem('tipo_usuario', result.tipo_usuario);

            // --- LÓGICA DE REDIRECIONAMENTO CORRIGIDA ---
            // Verifica o tipo de usuário retornado pelo servidor e redireciona
            if (result.tipo_usuario === 'cliente') {
                window.location.href = '/perfilcliente.html';
            } else if (result.tipo_usuario === 'cacambeiro') {
                window.location.href = '/perfilcacambeiro.html';
            } else {
                 // Se, por algum motivo, o tipo não for reconhecido, vai para a home
                window.location.href = '/index.html';
            }

        } else {
            // Exibe a mensagem de erro retornada pelo servidor
            mensagemErro.textContent = result.message || 'Erro ao fazer login.';
            mensagemErro.style.display = 'block';
        }
    } catch (error) {
        // Se houver um erro de rede
        console.error('Erro na requisição de login:', error);
        mensagemErro.textContent = 'Não foi possível conectar ao servidor.';
        mensagemErro.style.display = 'block';
    }
});