// script.js (VERSIÓN FINAL Y COMPLETA - CORREGIDA)

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* ===== BASE DE DATOS MOCK: Usuarios y Roles (PERSISTENTE) ===== */
    /* ========================================================= */
    
    const getEl = (id) => document.getElementById(id);
    
    // Usuarios iniciales
    const usuariosIniciales = [
        { email: 'admin@eventos.com', clave: '12345678', nombre: 'Admin Master', rol: 'admin' },
        { email: 'usuario@eventos.com', clave: 'password8', nombre: 'Juan User', rol: 'usuario' },
    ];
    
    let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || usuariosIniciales; 
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));

    // Base de Datos Mock (Información Adicional - NUEVO)
    let infoAdicional = JSON.parse(localStorage.getItem('infoAdicional')) || [];
    function guardarInfoAdicional() {
        localStorage.setItem('infoAdicional', JSON.stringify(infoAdicional));
    }


    /* --- Base de Datos Mock (Eventos POR DEFECTO) --- */
    const eventosPorDefecto = [
        { id: 1, titulo: "Ceremonia de Elección de Reina", fecha: "2025-10-28T18:00", descripcion: "Organizador: AFU-Asociación femenina Universitaria.", cupo: 200, registrados: 0, lugar: "Uleam - Plaza Centenario" }, 
        { id: 2, titulo: "Sesión conmemorativa (primer año)", fecha: "2025-10-29T10:00", descripcion: "Organiza: Instituto de neurociencias.", cupo: 150, registrados: 0, lugar: "Auditorio de comunicación" },
        { id: 3, titulo: "Entrega de esculturas", fecha: "2025-10-30T16:00", descripcion: "Organizada: Rectorado - DIOPM.", cupo: 120, registrados: 20, lugar: "Manta, Terminal FETUM" },
        { id: 4, titulo: "Inauguración de la casa Vesubio", fecha: "2025-11-03T10:00", descripcion: "Organiza: DIOPM - Dirección de infraestrucutra, obras, patrimonio y medio ambiente.", cupo: 160, registrados: 10, lugar: "Uleam Extensión Sucre - Bahía de Caráquez" },
        { id: 5, titulo: "Reencuentro institucional", fecha: "2025-11-06T16:00", descripcion: "Organiza: Asociación de profesores universitarios.", cupo: 450, registrados: 90, lugar: "Uleam - Plaza Centenario" },
        { id: 6, titulo: "Inauguración de campeonato interfacultades", fecha: "2025-11-07T10:00", descripcion: "Organiza: LDU - Liga Deportiva Universitaria.", cupo: 100, registrados: 44, lugar: "Uleam - Estadio" },
    ];

    let eventos = [...eventosPorDefecto];
    let misEventos = [...eventosPorDefecto];

    function guardarEventos() {} 

    /* ========================================================= */
    /* ===== 2. FUNCIONES GLOBALES DE UTILIDAD Y VALIDACIÓN ===== */
    /* ========================================================= */
    
    window.inputFoco = function(elemento) { elemento.style.borderColor = "#3366cc"; }
    window.inputFuera = function(elemento) { elemento.style.borderColor = "#ccc"; }

    function validarLogin(usuario, clave) {
        const formatoCorreo = /\S+@\S+\.\S+/;
        if (usuario.trim() === "" || clave.trim() === "") { alert("Por favor, completa todos los campos."); return false; }
        if (usuario.includes("@") && !formatoCorreo.test(usuario)) { alert("El correo ingresado no es válido. Ejemplo: usuario@gmail.com"); return false; }
        if (clave.length < 6) { alert("La contraseña debe tener al menos 6 caracteres."); return false; }
        return true; 
    }
    
    function mostrarError(elemento, mensaje, checkValido) {
        const errorEl = getEl(`error${elemento.id.charAt(0).toUpperCase() + elemento.id.slice(1)}`);
        
        let valido = checkValido;
        if (typeof checkValido === 'undefined') {
            valido = !mensaje;
        }

        if (errorEl) errorEl.textContent = mensaje;
        if (elemento) {
            if (typeof checkValido !== 'undefined') {
                 elemento.classList.remove('valido', 'invalido');
                 elemento.classList.add(valido ? 'valido' : 'invalido');
                 elemento.style.borderColor = valido ? "#28a745" : "red";
            }
        }
        return valido;
    }

    function validarNombre() {
        const nombre = getEl('nombre');
        const valido = nombre && nombre.value.trim().length >= 2;
        return mostrarError(nombre, valido ? '' : 'Mínimo 2 letras.', valido);
    }
    
    function validarApellido() {
        const apellido = getEl('apellido');
        const valido = apellido && apellido.value.trim().length >= 2;
        return mostrarError(apellido, valido ? '' : 'Mínimo 2 letras.', valido);
    }
    
    function validarCelular() {
        const celular = getEl('celular');
        const regex = /^\d{10}$/;
        const valido = celular && regex.test(celular.value.trim());
        return mostrarError(celular, valido ? '' : 'Debe tener 10 dígitos.', valido);
    }
    
    function validarEmail() {
        const email = getEl('email');
        const formatoCorreo = /\S+@\S+\.\S+/;
        const emailValue = email.value.trim();

        if (emailValue === '') return mostrarError(email, 'El correo es obligatorio.', false);
        if (!formatoCorreo.test(emailValue)) return mostrarError(email, 'Formato de correo inválido.', false);
        
        const isEditing = getEl('registroForm')?.dataset.editing === 'true';

        if (!isEditing && usuariosRegistrados.some(u => u.email === emailValue)) {
            return mostrarError(email, 'Correo ya registrado.', false);
        }
        
        return mostrarError(email, '', true);
    }

    function validarPassword() {
        const password = getEl('password');
        const valido = password && password.value.length >= 8;
        return mostrarError(password, valido ? '' : 'Mínimo 8 caracteres.', valido);
    }
    
    function validarConfirmar() {
        const password = getEl('password');
        const confirmar = getEl('confirmar');
        
        if (!confirmar || confirmar.value === '') {
            return mostrarError(confirmar, 'Confirma la contraseña.', false);
        }
        
        const coincide = confirmar.value === password.value;
        return mostrarError(confirmar, coincide ? '' : 'Las contraseñas no coinciden.', coincide);
    }
    
    function validarFormulario() { 
        const v1 = validarNombre();
        const v2 = validarApellido();
        const v3 = validarCelular();
        const v4 = validarEmail();
        const v5 = validarPassword();
        const v6 = validarConfirmar();
        return v1 && v2 && v3 && v4 && v5 && v6; 
    }


    /* ========================================================= */
    /* ===== 3. LÓGICA ESPECÍFICA DE CADA PÁGINA (MPA) ===== */
    /* ========================================================= */
    
    // --- Lógica para index.html/login.html (Login) ---
    const formLogin = getEl('form-login');
    if (formLogin) { 
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuarioEmail = getEl('login-usuario').value;
            const clave = getEl('login-clave').value;
            
            if (!validarLogin(usuarioEmail, clave)) { return; }

            const usuarioEncontrado = usuariosRegistrados.find(u => u.email === usuarioEmail && u.clave === clave );

            if (usuarioEncontrado) {
                alert(`Inicio de sesión correcto. ¡Bienvenido ${usuarioEncontrado.nombre} (${usuarioEncontrado.rol})!`);
                localStorage.setItem('userRole', usuarioEncontrado.rol);
                localStorage.setItem('userName', usuarioEncontrado.nombre);
                window.location.href = "app.html"; 
            } else {
                alert("Credenciales incorrectas. Intenta de nuevo.");
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
                const nuevoUsuario = { 
                    email: getEl('email').value,
                    clave: getEl('password').value,
                    nombre: getEl('nombre').value + ' ' + getEl('apellido').value,
                    rol: 'usuario' 
                };
                
                usuariosRegistrados.push(nuevoUsuario);
                localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
                alert(`Registro de ${nuevoUsuario.nombre} exitoso. Ya puedes iniciar sesión.`);
                window.location.href = "index.html"; 
            } else {
                 alert('Por favor, corrige los errores en el formulario.');
            }
        });
    }

    // --- Lógica para info.html (Registro de Información Adicional) ---
    const formInfo = getEl('form-info');
    if (formInfo) {
        
        // ❌ CÓDIGO ELIMINADO: La restricción que redirigía al administrador.
        /* const userRole = localStorage.getItem('userRole');
        if (userRole === 'admin') {
            alert('El administrador ya es dueño y no necesita registrar información adicional.');
            window.location.href = "app.html"; 
            return; // Detiene la ejecución del script en info.html para el admin
        }
        */
        
        formInfo.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = getEl('info-nombre').value;
            const tipo = getEl('info-tipo').value;
            
            if (nombre.trim() === '' || tipo === '') {
                alert('Por favor, complete al menos el nombre y el tipo.');
                return;
            }
            
            // Creación del objeto de información
            const nuevaInfo = {
                id: Date.now(),
                nombre: nombre,
                tipo: tipo,
                email: getEl('info-email').value || 'N/A',
                descripcion: getEl('info-descripcion').value || 'N/A',
                registradoPor: localStorage.getItem('userName') || 'Admin' 
            };

            // Guarda la nueva información y actualiza localStorage
            infoAdicional.push(nuevaInfo);
            guardarInfoAdicional(); 
            
            alert(`Información registrada (Tipo: ${tipo}, Nombre: ${nombre}).`);
            formInfo.reset();
            window.location.href = "app.html";
        });
    }


    // --- Lógica para app.html (Gestor de Eventos) ---
    const appPrincipal = getEl('app-principal');
    if (appPrincipal) { 

        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');
        
        if (!userRole) {
            alert("Sesión expirada o no iniciada. Por favor, ingresa.");
            window.location.href = "index.html"; 
            return; 
        }

        const eventosContainer = getEl('eventos-container');
        const formularioEvento = getEl('formulario-evento');
        const gestionContainer = getEl('eventos-gestion-container');
        const vistasApp = document.querySelectorAll('#app-principal .vista');
        
        const linkCrearEvento = getEl('btn-crear-evento'); 
        const linkMisEventos = getEl('btn-mis-eventos'); 
        const linkRegistrarInfo = getEl('link-a-info'); // Enlace de la barra de navegación (Header)

        
        function setMenuVisibility(role) {
            // Visibilidad de Herramientas de Gestión (Botones Admin)
            if (linkCrearEvento) linkCrearEvento.style.display = role === 'admin' ? 'inline-flex' : 'none';
            if (linkMisEventos) linkMisEventos.style.display = role === 'admin' ? 'inline-flex' : 'none';
            
            // ✅ CORRECCIÓN: Ahora el botón 'Registrar Info' es visible para todos.
            if (linkRegistrarInfo) {
                linkRegistrarInfo.style.display = 'inline-flex'; 
            }
            
            const headerTitle = document.querySelector('.header h1');
            if (headerTitle) {
                headerTitle.textContent = `🎓 Eventos Académicos (${userName} - ${role === 'admin' ? 'Admin' : 'Usuario'})`;
            }
        }
        
        setMenuVisibility(userRole);


        // --- FUNCIONES DE GESTIÓN DE VISTAS Y EVENTOS ---
        
        window.eliminarEvento = function(id) {
            const confirmacion = confirm("¿Estás seguro de que quieres eliminar este evento?");
            if (confirmacion) {
                eventos = eventos.filter(e => e.id !== id);
                misEventos = misEventos.filter(e => e.id !== id); 
                
                alert(`Evento con ID ${id} eliminado. Este cambio se perderá al recargar.`);
                renderizarGestionEventos(); 
                renderizarEventos(eventos); 
            }
        }
        
        window.mostrarVistaApp = function(idVista) {
            vistasApp.forEach(vista => {
                vista.classList.toggle('activa', vista.id === idVista);
            });
            
            if (idVista === 'gestion-eventos' && userRole === 'admin') {
                renderizarGestionEventos();
            } else if (idVista === 'lista-eventos') {
                renderizarEventos(eventos);
            }
        }

        function renderizarEventos(lista) {
            if (!eventosContainer) return;
            eventosContainer.innerHTML = '';
            
            // Lógica para deshabilitar el botón si es ADMIN
            const esAdmin = localStorage.getItem('userRole') === 'admin'; 
            const botonDeshabilitadoAdmin = esAdmin ? 'disabled' : ''; 
            const textoBotonAdmin = esAdmin ? 'Solo ver' : 'Registrarse'; 

             if (lista.length === 0) {
                 eventosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #555;">No hay eventos disponibles para mostrar.</p>';
                 return;
             }
            
            lista.forEach(evento => {
                const fechaObj = new Date(evento.fecha);
                const fechaStr = fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const horaStr = fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

                // Determinar el estado y texto final del botón
                const cupoAgotado = evento.registrados >= evento.cupo;
                // Si el cupo está agotado, se deshabilita. Si no, se usa la propiedad de deshabilitado por rol (admin)
                const estadoFinalBoton = cupoAgotado ? 'disabled' : botonDeshabilitadoAdmin;
                const textoFinalBoton = cupoAgotado ? 'Agotado' : (esAdmin ? textoBotonAdmin : 'Registrarse');
                // Se añade una clase diferente si el botón está deshabilitado por admin, para estilo (ver style.css)
                const claseFinalBoton = cupoAgotado ? 'btn-registro btn-agotado' : (esAdmin ? 'btn-registro btn-admin-view' : 'btn-registro');

                const tarjeta = document.createElement('article');
                tarjeta.className = 'tarjeta-evento';
                tarjeta.innerHTML = `
                    <h3>${evento.titulo}</h3>
                    <p class="meta-evento">
                        <i class="fas fa-calendar-alt"></i> ${fechaStr} ${horaStr} | 
                        <i class="fas fa-map-marker-alt"></i> ${evento.lugar}
                    </p>
                    <p>${evento.descripcion}</p>
                    <p class="cupo-info">Cupo: ${evento.registrados}/${evento.cupo}</p>
                    <button class="${claseFinalBoton}" data-id="${evento.id}" ${estadoFinalBoton}>
                        <i class="fas fa-check-circle"></i> ${textoFinalBoton}
                    </button>
                `;
                eventosContainer.appendChild(tarjeta);
            });
            agregarListenersRegistroAsistentes();
        }

        function agregarListenersRegistroAsistentes() {
            document.querySelectorAll('.btn-registro').forEach(btn => {
                const newButton = btn.cloneNode(true);
                btn.parentNode.replaceChild(newButton, btn);
                
                // Si es admin o está deshabilitado, no añade el listener.
                if (localStorage.getItem('userRole') === 'admin' || newButton.disabled) return; 

                newButton.addEventListener('click', (e) => {
                    const eventoId = parseInt(e.currentTarget.dataset.id);
                    const evento = eventos.find(e => e.id === eventoId);

                    if (evento && evento.registrados < evento.cupo) {
                        evento.registrados++; 
                        alert(`¡Te has registrado con éxito a "${evento.titulo}"! (El registro se perderá al recargar)`);
                        renderizarEventos(eventos); 
                    } else if (evento.registrados >= evento.cupo) {
                        alert("Lo sentimos, el cupo para este evento está agotado.");
                    }
                });
            });
        }
        
        function renderizarGestionEventos() {
            if (!gestionContainer) return;
            gestionContainer.innerHTML = '';
            
            if (misEventos.length === 0) { 
                 gestionContainer.innerHTML = '<p>Aún no has creado ningún evento. Ve a "Crear Evento" para empezar.</p>';
                 return;
            }
            
            misEventos.forEach(evento => {
                const gestionItem = document.createElement('div');
                gestionItem.className = 'gestion-item';

                let adminButtons = `
                    <button class="btn-notificar" data-id="${evento.id}"><i class="fas fa-bell"></i> Notificar</button>
                    <button class="btn-ver-asistentes" data-id="${evento.id}"><i class="fas fa-users"></i> Ver Lista</button>
                    <button class="btn-eliminar-evento" data-id="${evento.id}" onclick="eliminarEvento(${evento.id})"><i class="fas fa-trash"></i> Eliminar</button>
                `;
                
                gestionItem.innerHTML = `
                    <span>
                        <strong>${evento.titulo}</strong> 
                        (Lugar: ${evento.lugar}) 
                        (Asistentes: ${evento.registrados}/${evento.cupo})
                    </span>
                    <div>
                        ${adminButtons}
                    </div>
                `;
                gestionContainer.appendChild(gestionItem);
            });
            
            gestionContainer.querySelectorAll('.btn-notificar').forEach(btn => {
                btn.addEventListener('click', () => alert(`Simulación: Notificación enviada a los asistentes de: ${eventos.find(e => e.id === parseInt(btn.dataset.id)).titulo}`));
            });
            gestionContainer.querySelectorAll('.btn-ver-asistentes').forEach(btn => {
                btn.addEventListener('click', () => alert(`Simulación: Lista de asistentes para: ${eventos.find(e => e.id === parseInt(btn.dataset.id)).titulo}`));
            });
        }

        if (formularioEvento) {
            formularioEvento.addEventListener('submit', (e) => {
                e.preventDefault();

                const titulo = getEl('titulo').value;
                const fecha = getEl('fecha').value;
                const descripcion = getEl('descripcion').value;
                const lugarInput = getEl('lugar');
                const lugar = lugarInput ? lugarInput.value : 'Por confirmar'; 
                const cupo = parseInt(getEl('cupo').value);

                if (!titulo || !fecha || !descripcion || !lugar || isNaN(cupo) || cupo <= 0) {
                    alert("Por favor, completa todos los campos del evento correctamente.");
                    return; 
                }

                const nuevoEvento = {
                    id: Date.now(), 
                    titulo: titulo,
                    fecha: fecha, 
                    descripcion: descripcion,
                    cupo: cupo,
                    registrados: 0,
                    lugar: lugar 
                };
                
                eventos.push(nuevoEvento);
                misEventos.push(nuevoEvento);
                
                formularioEvento.reset();
                alert(`Evento "${nuevoEvento.titulo}" creado y publicado. Se perderá al recargar.`);
                mostrarVistaApp('lista-eventos');
            });
        }
        
        // Navegación interna de la App
        getEl('btn-crear-evento')?.addEventListener('click', () => mostrarVistaApp('crear-evento'));
        getEl('btn-mis-eventos')?.addEventListener('click', () => mostrarVistaApp('gestion-eventos'));
        
        // Lógica de Cerrar Sesión
        getEl('link-logout')?.addEventListener('click', (e) => {
             e.preventDefault(); 
             localStorage.removeItem('userRole'); 
             localStorage.removeItem('userName'); 
             window.location.href = "index.html"; 
        });

        // --- INICIALIZACIÓN DE LA APP ---
        mostrarVistaApp('lista-eventos');
    }
});


