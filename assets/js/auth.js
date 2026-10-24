document.addEventListener('DOMContentLoaded', () => {
    // 1. MANEJO DEL FORMULARIO DE REGISTRO
    const formRegistro = document.querySelector('#seccion-registro form, .auth-layout form:nth-of-type(2)');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue

            // Capturar los valores del formulario de registro
            const nombre = document.getElementById('nombre').value.trim();
            const edad = document.getElementById('edad').value.trim();
            const correo = document.getElementById('correo-reg').value.trim().toLowerCase();
            const sexo = document.getElementById('sexo').value;
            const password = document.getElementById('password-reg').value;

            // Obtener los usuarios guardados previamente o inicializar un arreglo vacío
            let usuarios = JSON.parse(localStorage.getItem('spineAlign_usuarios')) || [];

            // Verificar si el correo ya está registrado
            const usuarioExistente = usuarios.find(u => u.correo === correo);
            if (usuarioExistente) {
                alert('⚠️ Este correo electrónico ya está registrado. Intenta iniciar sesión.');
                return;
            }

            // Crear el objeto del nuevo usuario
            const nuevoUsuario = {
                nombre,
                edad,
                correo,
                sexo,
                password
            };

            // Guardar en la "base de datos" simulada (localStorage)
            usuarios.push(nuevoUsuario);
            localStorage.setItem('spineAlign_usuarios', JSON.stringify(usuarios));

            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            formRegistro.reset();
            
            // Opcional: hacer scroll suave hacia arriba para que inicie sesión
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. MANEJO DEL FORMULARIO DE INICIO DE SESIÓN
    const formLogin = document.querySelector('.auth-layout form:nth-of-type(1)');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const correoIngresado = document.getElementById('correo').value.trim().toLowerCase();
            const passwordIngresado = document.getElementById('password').value;

            // Consultar usuarios guardados
            const usuarios = JSON.parse(localStorage.getItem('spineAlign_usuarios')) || [];

            // Buscar si el usuario existe y la contraseña coincide
            const usuarioValido = usuarios.find(u => u.correo === correoIngresado && u.password === passwordIngresado);

            if (usuarioValido) {
                // Guardar la sesión activa del usuario actual
                localStorage.setItem('spineAlign_sesionActiva', JSON.stringify({
                    nombre: usuarioValido.nombre,
                    correo: usuarioValido.correo
                }));

                alert(`¡Bienvenido de nuevo, ${usuarioValido.nombre}!`);
                
                // Redirigir a la herramienta de evaluación
                window.location.href = 'evaluar.html';
            } else {
                alert('❌ Correo o contraseña incorrectos. Verifica tus datos o regístrate.');
            }
        });
    }
});