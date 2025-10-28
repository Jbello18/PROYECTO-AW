document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* ===== 1. FUNCIONES GLOBALES DE UTILIDAD Y VALIDACIÓN ===== */
    /* ========================================================= */

    /** Aplica/remueve el estilo de foco. */
    window.inputFoco = function(elemento) {
        elemento.style.borderColor = "#004B8D"; /* Color ULEAM */
    }
    window.inputFuera = function(elemento) {
        elemento.style.borderColor = "#ccc";
    }

    /** Valida los campos de inicio de sesión. */
    function validarLogin(usuario, clave) {
        const formatoCorreo = /\S+@\S+\.\S+/;

        if (usuario.trim() === "" || clave.trim() === "") {
            alert("Por favor, completa todos los campos.");
            return false;
        }
        
        if (usuario.includes("@") && !formatoCorreo.test(usuario)) {
            alert("El correo ingresado no es válido. Ejemplo: usuario@gmail.com");
            return false;
        }
        
        if (clave.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }
        return true; 
    }

    // --- Funciones de Validación de Registro ---
    const getEl = (id) => document.getElementById(id);

    function validarNombre() {
        const nombre = getEl('nombre');
        const error = getEl('errorNombre');
        const valido = nombre && nombre.value.trim() !== '';
        if (error) error.textContent = valido ? '' : 'El nombre es obligatorio.';
        if (nombre) nombre.className = valido ? 'valido' : 'invalido';
        return valido;
    }

    function validarApellido() {
        const apellido = getEl('apellido');
        const error = getEl('errorApellido');
        const valido = apellido && apellido.value.trim() !== '';
        if (error) error.textContent = valido ? '' : 'El apellido es obligatorio.';
        if (apellido) apellido.className = valido ? 'valido' : 'invalido';
        return valido;
    }

    function validarCelular() {
        const celular = getEl('celular');
        const error = getEl('errorCelular');
        const valido = celular && celular.value.length === 10 && /^\d+$/.test(celular.value);
        if (error) error.textContent = valido ? '' : 'El celular debe tener 10 dígitos.';
        if (celular) celular.className = valido ? 'valido' : 'invalido';
        return valido;
    }

    function validarEmail() {
        const email = getEl('email');
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const error = getEl('errorEmail');
        const valido = email && regex.test(email.value);
        if (error) error.textContent = valido ? '' : 'Ingrese un email válido.';
        if (email) email.className = valido ? 'valido' : 'invalido';
        return valido;
    }

    function validarPassword() {
        const password = getEl('password');
        const error = getEl('errorPassword');
        const valido = password && password.value.length >= 8;
        if (error) error.textContent = valido ? '' : 'La contraseña debe tener al menos 8 caracteres.';
        if (password) password.className = valido ? 'valido' : 'invalido';
        return valido;
    }

    function validarConfirmar() {
        const confirmar = getEl('confirmar');
        const password = getEl('password');
        const error = getEl('errorConfirmar');
        
        let valido = confirmar && confirmar.value !== '';
        if (!valido) {
            if (error) error.textContent = 'Confirma la contraseña.';
        } else if (confirmar.value !== password.value) {
            valido = false;
            if (error) error.textContent = 'Las contraseñas no coinciden.';
        } else {
            if (error) error.textContent = '';
        }
        if (confirmar) confirmar.className = valido ? 'valido' : 'invalido';
        return valido;
    }

    /** Función principal para validar todos los campos de registro. */
    function validarFormulario() {
        const esNombreValido = validarNombre();
        const esApellidoValido = validarApellido();
        const esCelularValido = validarCelular();
        const esEmailValido = validarEmail();
        const esPasswordValido = validarPassword();
        const esConfirmarValido = validarConfirmar();
        
        return esNombreValido && esApellidoValido && esCelularValido && esEmailValido && esPasswordValido && esConfirmarValido;
    }


    /* ========================================================= */
    /* ===== 2. LÓGICA ESPECÍFICA DE CADA PÁGINA (MPA) ===== */
    /* ========================================================= */
    
    // --- Lógica para index.html (Login) ---
    const formLogin = getEl('form-login');
    if (formLogin) { 
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = getEl('login-usuario').value;
            const clave = getEl('login-clave').value;
            
            if (validarLogin(usuario, clave)) { 
                alert("Inicio de sesión correcto. ¡Bienvenido a Eventos ULEAM!");
                window.location.href = "app.html"; 
            }
        });
    }

    // --- Lógica para registro.html ---
    const registroForm = getEl('registroForm');
    if (registroForm) { 
        getEl('nombre')?.addEventListener('input', validarNombre);
        getEl('apellido')?.addEventListener('input', validarApellido);
        getEl('celular')?.addEventListener('input', validarCelular);
        getEl('email')?.addEventListener('input', validarEmail);
        getEl('password')?.addEventListener('input', validarPassword);
        getEl('confirmar')?.addEventListener('input', validarConfirmar);

        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormulario()) { 
                alert('Registro exitoso. Serás redirigido a iniciar sesión.');
                // CORRECCIÓN: Redirigir a index.html (que es la página de login)
                window.location.href = "index.html"; 
            } else {
                 alert('Por favor, corrige los errores en el formulario.');
            }
        });
    }

    // --- Lógica para info.html (NUEVA INTERFACE 4) ---
    const formInfo = getEl('form-info');
    if (formInfo) {
        formInfo.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = getEl('info-nombre').value;
            const tipo = getEl('info-tipo').value;
            
            if (nombre.trim() === '' || tipo === '') {
                alert('Por favor, complete al menos el nombre y el tipo.');
                return;
            }
            
            alert(`Información registrada (Tipo: ${tipo}, Nombre: ${nombre}).`);
            // Simulación de guardado (no hay BD)
            formInfo.reset();
            // Opcional: Redirigir de vuelta a la app
            // window.location.href = "app.html";
        });
    }


    // --- Lógica para app.html (Gestor de Eventos) ---
    const appPrincipal = getEl('app-principal');
    if (appPrincipal) { 

        // --- REFERENCIAS A VISTAS Y DATOS ---
        const eventosContainer = getEl('eventos-container');
        const formularioEvento = getEl('formulario-evento');
        const gestionContainer = getEl('eventos-gestion-container');
        const vistasApp = document.querySelectorAll('#app-principal .vista');

        // Base de Datos Mock (Eventos ULEAM)
        let eventos = [
            { id: 1, titulo: "Jornadas de Investigación en Ciencias de la Educación", fecha: "2025-11-20T09:00", descripcion: "La Facultad de Ciencias de la Educación presenta sus avances en investigación.", cupo: 150, registrados: 45, lugar: "Fac. Ciencias de la Educación" },
            { id: 2, titulo: "II Jornadas Científicas Estudiantiles (Pedernales)", fecha: "2025-11-25T10:00", descripcion: "Presentación de proyectos estudiantiles del Campus Pedernales.", cupo: 80, registrados: 78, lugar: "Campus Pedernales" },
            { id: 3, titulo: "Taller de Análisis Curricular", fecha: "2025-12-01T14:00", descripcion: "Organizado por la Facultad de Trabajo Social para la revisión de la malla.", cupo: 40, registrados: 10, lugar: "Fac. Trabajo Social" },
            { id: 4, titulo: "Conferencia: Prevención de Riesgos Naturales", fecha: "2025-12-05T11:00", descripcion: "Evento del Club Ecológico y la carrera de Turismo.", cupo: 200, registrados: 190, lugar: "Paraninfo" },
            { id: 5, titulo: "I Jornada Científica de Laboratorio Clínico", fecha: "2025-12-10T08:30", descripcion: "Ciencia, ética y excelencia al servicio de la salud.", cupo: 100, registrados: 30, lugar: "Fac. Ciencias de la Salud" }
        ];
        let misEventos = [eventos[0], eventos[2]]; // Simula que el usuario creó estos


        // --- FUNCIONES DE LA APP ---
        
        window.mostrarVistaApp = function(idVista) {
            vistasApp.forEach(vista => {
                if (vista.id === idVista) {
                    vista.classList.add('activa');
                } else {
                    vista.classList.remove('activa');
                }
            });
            
            if (idVista === 'gestion-eventos') {
                renderizarGestionEventos();
            } else if (idVista === 'lista-eventos') {
                renderizarEventos(eventos);
            }
        }

        function renderizarEventos(lista) {
            if (!eventosContainer) return;
            eventosContainer.innerHTML = '';
            lista.forEach(evento => {
                const tarjeta = document.createElement('article');
                tarjeta.className = 'tarjeta-evento';
                tarjeta.innerHTML = `
                    <h3>${evento.titulo}</h3>
                    <p class="meta-evento">
                        <i class="fas fa-calendar-alt"></i> ${new Date(evento.fecha).toLocaleDateString()} ${new Date(evento.fecha).toLocaleTimeString()} | 
                        <i class="fas fa-map-marker-alt"></i> ${evento.lugar}
                    </p>
                    <p>${evento.descripcion}</p>
                    <p class="cupo-info">Cupo: ${evento.registrados}/${evento.cupo}</p>
                    <button class="btn-registro" data-id="${evento.id}" ${evento.registrados >= evento.cupo ? 'disabled' : ''}>
                        <i class="fas fa-check-circle"></i> ${evento.registrados >= evento.cupo ? 'Agotado' : 'Registrarse'}
                    </button>
                `;
                eventosContainer.appendChild(tarjeta);
            });
            agregarListenersRegistroAsistentes();
        }

        function agregarListenersRegistroAsistentes() {
            document.querySelectorAll('.btn-registro').forEach(button => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                newButton.addEventListener('click', (e) => {
                    const eventoId = parseInt(e.target.dataset.id);
                    const evento = eventos.find(e => e.id === eventoId);

                    if (evento && evento.registrados < evento.cupo) {
                        evento.registrados++;
                        alert(`¡Registro exitoso para "${evento.titulo}"!`);
                        renderizarEventos(eventos);
                    } else {
                        alert('Cupo completo. No se pudo registrar.');
                    }
                });
            });
        }
        
        function renderizarGestionEventos() {
            if (!gestionContainer) return;
            gestionContainer.innerHTML = '';
            misEventos.forEach(evento => {
                const gestionItem = document.createElement('div');
                gestionItem.className = 'gestion-item';
                gestionItem.innerHTML = `
                    <span>${evento.titulo} (Asistentes: ${evento.registrados}/${evento.cupo})</span>
                    <div>
                        <button class="btn-notificar" data-id="${evento.id}"><i class="fas fa-bell"></i> Notificar</button>
                        <button class="btn-ver-asistentes" data-id="${evento.id}"><i class="fas fa-users"></i> Ver Lista</button>
                    </div>
                `;
                gestionContainer.appendChild(gestionItem);
            });
            
            gestionContainer.querySelectorAll('.btn-notificar').forEach(btn => {
                btn.addEventListener('click', () => alert(`Simulación: Notificación enviada a los asistentes.`));
            });
            gestionContainer.querySelectorAll('.btn-ver-asistentes').forEach(btn => {
                btn.addEventListener('click', () => alert(`Simulación: Mostrando lista de asistentes.`));
            });
        }

        if (formularioEvento) {
            formularioEvento.addEventListener('submit', (e) => {
                e.preventDefault();
                const nuevoEvento = {
                    id: eventos.length + 1,
                    titulo: getEl('titulo').value,
                    fecha: getEl('fecha').value,
                    descripcion: getEl('descripcion').value,
                    cupo: parseInt(getEl('cupo').value),
                    registrados: 0,
                    lugar: "Por confirmar"
                };
                
                eventos.push(nuevoEvento);
                misEventos.push(nuevoEvento); // Añade el nuevo evento a "mis eventos"
                formularioEvento.reset();
                alert(`Evento "${nuevoEvento.titulo}" creado y publicado.`);
                mostrarVistaApp('lista-eventos');
            });
        }
        
        // Navegación interna de la App
        getEl('btn-lista-eventos')?.addEventListener('click', () => mostrarVistaApp('lista-eventos'));
        getEl('btn-crear-evento')?.addEventListener('click', () => mostrarVistaApp('crear-evento'));
        getEl('btn-mis-eventos')?.addEventListener('click', () => mostrarVistaApp('gestion-eventos'));
        // El link de logout ya apunta a index.html

        // --- INICIALIZACIÓN DE LA APP ---
        mostrarVistaApp('lista-eventos');
    }
});
