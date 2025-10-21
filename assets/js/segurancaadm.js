var token = localStorage.getItem('token');
var cargo = localStorage.getItem('cargo');

// Se não tiver token, volta pro login
if (token == null) {
    window.location.href = 'login.html';
}

// Se o cargo não for ADM, volta pro login também
if (cargo !== 'ADM') {
    window.location.href = 'login.html';
}
