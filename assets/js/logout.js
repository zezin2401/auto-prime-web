const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', function(e) {
e.preventDefault(); // Evita que a página tente seguir o link

        // Limpa todo o localStorage
        localStorage.clear();

        // Mostra um alerta de confirmação
        Swal.fire({
            icon: 'success',
            title: 'Logout realizado!',
            text: 'Você será redirecionado para a página de login.',
            confirmButtonText: 'Ok'
        }).then(() => {
            // Redireciona para a página de login
            window.location.href = 'login.html'; // Substitua pelo caminho da sua página de login
        });
    });