document.addEventListener('DOMContentLoaded', () => {
    // 1. REGISTRO SIMULADO
    const formRegistro = document.querySelector('.auth-layout form:nth-of-type(2)');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo-reg').value.trim().toLowerCase();
            const password = document.getElementById('password-reg').value;

            const nuevoUsuario = { nombre, correo, password };
            localStorage.setItem('usuarioSpineAlign', JSON.stringify(nuevoUsuario));

            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            formRegistro.reset();
        });
    }

    // 2. LOGIN SIMULADO
    const formLogin = document.querySelector('.auth-layout form:nth-of-type(1)');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const correoIngresado = document.getElementById('correo').value.trim().toLowerCase();
            const passwordIngresado = document.getElementById('password').value;

            const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioSpineAlign'));

            if (usuarioGuardado && usuarioGuardado.correo === correoIngresado && usuarioGuardado.password === passwordIngresado) {
                alert(`¡Bienvenido de nuevo, ${usuarioGuardado.nombre}!`);
                window.location.href = 'evaluar.html';
            } else {
                alert('❌ Correo o contraseña incorrectos.');
            }
        });
    }
});