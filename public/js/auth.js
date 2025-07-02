// public/js/auth.js

document.addEventListener('DOMContentLoaded', async () => {
    const userSessionContainer = document.getElementById('user-session-container');
    const loginMenuItem = document.getElementById('login-menu-item'); // Pega o item do menu de login

    if (!userSessionContainer || !loginMenuItem) {
        return;
    }

    try {
        const response = await fetch('/users/api/session-info');
        const data = await response.json();

        if (data.loggedIn) {
            // Usuário está LOGADO
            const usuario = data.usuario;
            const perfilUrl = usuario.tipo_usuario === 'cacambeiro' ? '/perfilcacambeiro.html' : '/perfilcliente.html';

            // Esconde o botão de "Login" do menu
            loginMenuItem.style.display = 'none';

            // Cria o HTML de "boas-vindas" com os links de perfil e sair
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
            // Usuário NÃO está logado
            // Garante que o container de sessão esteja vazio e o botão de login visível
            userSessionContainer.innerHTML = '';
            loginMenuItem.style.display = 'list-item';
        }
    } catch (error) {
        console.error('Erro ao buscar dados da sessão:', error);
        userSessionContainer.innerHTML = '';
        loginMenuItem.style.display = 'list-item';
    }
});