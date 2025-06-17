// /public/js/auth.js
document.addEventListener('DOMContentLoaded', async () => {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    try {
        const response = await fetch('/api/users/status');
        const data = await response.json();

        let navHTML = `
            <a href="/">Home</a>
            <a href="/servicos">Serviços</a>
        `;

        if (data.loggedIn) {
            navHTML += `
                <a href="/carrinho">Carrinho</a>
                <a href="#">Olá, ${data.userName}</a>
                <a href="#" id="logout-btn">Logout</a>
            `;
        } else {
            navHTML += `
                <a href="/login">Login</a>
                <a href="/cadastro">Cadastro</a>
            `;
        }
        
        nav.innerHTML = navHTML;

        // Adiciona evento de clique para o botão de logout se ele existir
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const logoutResponse = await fetch('/api/users/logout');
                const logoutResult = await logoutResponse.json();
                if(logoutResult.redirectUrl) {
                    window.location.href = logoutResult.redirectUrl;
                }
            });
        }

    } catch (error) {
        console.error('Erro ao verificar status de login:', error);
        // Fallback para menu de deslogado
        nav.innerHTML = `
            <a href="/">Home</a>
            <a href="/servicos">Serviços</a>
            <a href="/login">Login</a>
            <a href="/cadastro">Cadastro</a>
        `;
    }
});