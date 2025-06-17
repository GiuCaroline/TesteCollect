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
const SUPABASE_URL = 'https://pgrwhhznlmdqaiwykvwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncndoaHpubG1kcWFpd3lrdndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzU3ODksImV4cCI6MjA2NTY1MTc4OX0.m8VEHnHT1koXM98ClsWtqR7Ns45INxQqkpLOeBfz0lA';

// Inicializa o cliente do Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exemplo de como buscar dados de uma tabela chamada 'produtos'
async function buscarProdutos() {
    try {
        const { data, error } = await supabase
            .from('produtos') // O nome da sua tabela
            .select('*'); // '*' para selecionar todas as colunas

        if (error) {
            throw error;
        }

        console.log('Produtos encontrados:', data);
        // Aqui você pode adicionar o código para exibir os dados na sua página
    } catch (error) {
        console.error('Erro ao buscar produtos:', error.message);
    }
}

// Chame a função para testar
buscarProdutos();