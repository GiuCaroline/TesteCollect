// public/js/auth.js

document.addEventListener('DOMContentLoaded', async () => {
    // Procura o container no HTML onde as informações do usuário serão exibidas
    const userSessionContainer = document.getElementById('user-session-container');

    // Se a página não tiver este container, o script para aqui para evitar erros.
    if (!userSessionContainer) {
        return;
    }

    try {
        // Chama a nossa API no backend para buscar as informações da sessão
        const response = await fetch('/users/api/session-info');
        const data = await response.json();

        if (data.loggedIn) {
            // Se a resposta for 'loggedIn: true', o usuário está logado.
            const usuario = data.usuario;
            const perfilUrl = usuario.tipo === 'cacambeiro' ? '/perfilcacambeiro.html' : '/perfilcliente.html';

            // Cria o HTML de "boas-vindas" e o insere no container
            userSessionContainer.innerHTML = `
                <div class="perfil-sair">
                    <span>Bem-vindo,<br> ${usuario.nome}</span>
                    <a href="${perfilUrl}">
                        <img src="/imagens/perfil.png" alt="Perfil" id="perfil" width="35" height="35">
                    </a>
                    <a href="/users/logout">
                        <img src="/imagens/sair.png" alt="Sair" id="sair" width="37" height="37">
                    </a>
                </div>
            `;
        } else {
            // Se 'loggedIn' for false, mostra um botão de Login.
            userSessionContainer.innerHTML = `<a href="/login.html" class="login-button">Login</a>`;
        }
    } catch (error) {
        console.error('Erro ao buscar dados da sessão:', error);
        // Em caso de erro de comunicação, mostra o botão de login como fallback.
        userSessionContainer.innerHTML = `<a href="/login.html" class="login-button">Login</a>`;
    }
});