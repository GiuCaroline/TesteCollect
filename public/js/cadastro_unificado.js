document.addEventListener('DOMContentLoaded', function() {
    const tipo_usuarioSelect = document.getElementById('tipo_usuario');
    const additionalFields = document.getElementById('additionalFields');

    tipo_usuarioSelect.addEventListener('change', function() {
        if (this.value === 'cacambeiro') {
            additionalFields.style.display = 'block';
        } else {
            additionalFields.style.display = 'none';
        }
    });

    document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const tipo_usuario = document.getElementById('tipo_usuario').value;

        // Validação básica no lado do cliente
        if (!nome || !email || !senha || !tipo_usuario) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            // CORREÇÃO: A URL do fetch deve ser '/cadastro'
            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    tipo_usuario
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Exibe "Usuário cadastrado com sucesso!"
                window.location.href = '/index.html';
            } else {
                // Exibe a mensagem de erro vinda do servidor (ex: "E-mail já em uso")
                alert('Erro: ' + result.error);
            }

        } catch (error) {
            console.error('Erro no fetch:', error);
            alert('Ocorreu um erro ao tentar realizar o cadastro. Verifique a consola para mais detalhes.');
        }
    });
});