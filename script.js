
// Variables globales 
let usuariosRegistrados = [];
let infoAdicional = [];

// para que siempre se vean los datos
let listaEventosDefecto = [
     { id: 1, titulo: "Ceremonia de Elección de Reina", fecha: "2025-10-28T18:00", descripcion: "Organizador: AFU-Asociación femenina Universitaria.", cupo: 200, registrados: 0, lugar: "Uleam - Plaza Centenario" }, 
    { id: 2, titulo: "Sesión conmemorativa (primer año)", fecha: "2025-10-29T10:00", descripcion: "Organiza: Instituto de neurociencias.", cupo: 150, registrados: 0, lugar: "Auditorio de comunicación" },
    { id: 3, titulo: "Entrega de esculturas", fecha: "2025-10-30T16:00", descripcion: "Organizada: Rectorado - DIOPM.", cupo: 120, registrados: 20, lugar: "Manta, Terminal FETUM" },
    { id: 4, titulo: "Inauguración de la casa Vesubio", fecha: "2025-11-03T10:00", descripcion: "Organiza: DIOPM - Dirección de infraestrucutra, obras, patrimonio y medio ambiente.", cupo: 160, registrados: 10, lugar: "Uleam Extensión Sucre - Bahía de Caráquez" },
    { id: 5, titulo: "Reencuentro institucional", fecha: "2025-11-06T16:00", descripcion: "Organiza: Asociación de profesores universitarios.", cupo: 450, registrados: 90, lugar: "Uleam - Plaza Centenario" },
    { id: 6, titulo: "Inauguración de campeonato interfacultades", fecha: "2025-11-07T10:00", descripcion: "Organiza: LDU - Liga Deportiva Universitaria.", cupo: 100, registrados: 44, lugar: "Uleam - Estadio" },
]; 

// contienen los datos corgados
let eventos = [];
let misEventos = [];

// Función simple para obtener elementos por ID
function getEl(id) {
    return document.getElementById(id);
}

// FUNCIÓN DE INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicialización de la Base de Datos (Usuarios por defecto)
    const usuariosIniciales = [
        { email: 'admin@eventos.com', clave: '12345678', nombre: 'Admin Master', rol: 'admin' },
        { email: 'usuario@eventos.com', clave: 'password8', nombre: 'Juan User', rol: 'usuario' },
    ];
    
    usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || usuariosIniciales;
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados)); 

    infoAdicional = JSON.parse(localStorage.getItem('infoAdicional')) || [];
    
    //carga siempre los eventos
    eventos = listaEventosDefecto; 
    
    misEventos = eventos.filter(e => e.id % 2 === 0); // Eventos del admin

    //Ejecuta lógica específica para la página actual
    if (getEl('login-form')) {
        configurarLogin();
    } else if (getEl('registro-form')) {
        configurarRegistro();
    } else if (getEl('app-principal')) {
        configurarAppPrincipal();
    } else if (getEl('form-info')) {
        configurarFormInfo();
    }
});

//LÓGICA DE INICIO DE SESIÓN

function configurarLogin() {
    getEl('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuarioEmail = getEl('email').value;
        const clave = getEl('password').value;
        
        if (usuarioEmail.trim() === "" || clave.trim() === "") { 
            alert("Completa ambos campos."); 
            return; 
        }

        const usuarioEncontrado = usuariosRegistrados.find(u => u.email === usuarioEmail && u.clave === clave);

        if (usuarioEncontrado) {
            alert('Inicio de sesión correcto. ¡Bienvenido ' + usuarioEncontrado.nombre + '!');
            localStorage.setItem('userRole', usuarioEncontrado.rol);
            localStorage.setItem('userName', usuarioEncontrado.nombre);
            window.location.href = "app.html";
        } else {
            alert("Credenciales incorrectas. (Recuerda: admin@eventos.com/12345678)");
        }
    });
}

//LÓGICA DE REGISTRO

function configurarRegistro() {
    getEl('registro-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = getEl('reg-email');
        const passwordInput = getEl('reg-password');
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        let valido = true;

        if (!/\S+@\S+\.\S+/.test(email)) {
             alert('Email inválido.');
             valido = false;
        } else if (usuariosRegistrados.some(u => u.email === email)) {
             alert('Correo ya registrado.');
             valido = false;
        } else if (password.length < 8) {
             alert('La contraseña debe tener al menos 8 caracteres.');
             valido = false;
        }

        if (valido) {
            const nuevoUsuario = {
                email: email,
                clave: password,
                nombre: 'Usuario Nuevo',
                rol: 'usuario'
            };
            
            usuariosRegistrados.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
            alert('Registro exitoso. Ya puedes iniciar sesión.');
            window.location.href = "index.html";
        }
    });
}

//LÓGICA PRINCIPAL DE LA APLICACIÓN

function configurarAppPrincipal() {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        window.location.href = "index.html";
        return;
    }
    
    // Configurar menú y encabezado
    getEl('btn-crear-evento').style.display = userRole === 'admin' ? 'inline-flex' : 'none';
    getEl('btn-mis-eventos').style.display = userRole === 'admin' ? 'inline-flex' : 'none';
    
    // Asignar listeners a la navegación del menú
    getEl('btn-lista-eventos').addEventListener('click', function() { mostrarVista('lista-eventos'); });
    getEl('btn-crear-evento')?.addEventListener('click', function() { mostrarVista('crear-evento'); });
    getEl('btn-mis-eventos')?.addEventListener('click', function() { mostrarVista('gestion-eventos'); });
    getEl('link-logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = "index.html";
    });

    // Manejar el submit del formulario de creación de eventos
    getEl('formulario-evento')?.addEventListener('submit', crearEvento);

    // Inicializar la vista
    mostrarVista('lista-eventos');
}

function mostrarVista(idVista) {
    const vistasApp = document.querySelectorAll('#app-principal .vista');
    vistasApp.forEach(vista => {
        vista.classList.remove('activa');
    });

    const vistaActiva = getEl(idVista);
    if (vistaActiva) {
        vistaActiva.classList.add('activa');
    }

    if (idVista === 'gestion-eventos' && localStorage.getItem('userRole') === 'admin') {
        renderizarGestionEventos();
    } else if (idVista === 'lista-eventos') {
        renderizarEventos(eventos);
    }
}

function renderizarEventos(lista) {
    const eventosContainer = getEl('eventos-container');
    if (!eventosContainer) return;
    
    // Limpia la lista
    eventosContainer.innerHTML = '';
    
    const esAdmin = localStorage.getItem('userRole') === 'admin';
    
    if (lista.length === 0) {
        eventosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #555;">No hay eventos disponibles.</p>';
        return;
    }
    
    for (let i = 0; i < lista.length; i++) {
        const evento = lista[i];

        const fechaObj = new Date(evento.fecha);
        const fechaStr = fechaObj.toLocaleDateString('es-ES');
        const horaStr = fechaObj.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});

        const cupoAgotado = evento.registrados >= evento.cupo;
        
        let estadoBoton = '';
        let textoBoton = 'Registrarse';
        let claseBoton = 'btn-registro';
        
        if (cupoAgotado) {
            estadoBoton = 'disabled';
            textoBoton = 'Agotado';
            claseBoton = 'btn-registro btn-agotado';
        } else if (esAdmin) {
            estadoBoton = 'disabled';
            textoBoton = 'Solo ver';
            claseBoton = 'btn-registro btn-admin-view';
        }
        
        eventosContainer.innerHTML += `
            <article class="tarjeta-evento">
                <h3>${evento.titulo}</h3>
                <p class="meta-evento">
                    <i class="fas fa-calendar-alt"></i> ${fechaStr} ${horaStr} | <i class="fas fa-map-marker-alt"></i> ${evento.lugar}
                </p>
                <p>${evento.descripcion}</p>
                <p class="cupo-info">Cupo: ${evento.registrados}/${evento.cupo}</p>
                <button class="${claseBoton}" onclick="manejarRegistro(${evento.id})" data-id="${evento.id}" ${estadoBoton}>
                    <i class="fas fa-check-circle"></i> ${textoBoton}
                </button>
            </article>
        `;
    }
}

function manejarRegistro(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);

    if (evento && evento.registrados < evento.cupo) {
        evento.registrados++;
        alert(`¡Te has registrado a "${evento.titulo}"!`);
        renderizarEventos(eventos); 
    } else if (evento.registrados >= evento.cupo) {
        alert("Cupo agotado.");
    }
}

function crearEvento(e) {
    e.preventDefault();
    
    const titulo = getEl('titulo').value;
    const fecha = getEl('fecha').value;
    const descripcion = getEl('descripcion').value;
    const lugar = getEl('lugar').value;
    const cupo = parseInt(getEl('cupo').value);

    if (!titulo || !fecha || !descripcion || !lugar || isNaN(cupo) || cupo <= 0) {
        alert("Completa todos los campos correctamente.");
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
    
    // Estos eventos creados si se guardarán 
    eventos.push(nuevoEvento);
    misEventos.push(nuevoEvento);
    
    getEl('formulario-evento').reset();
    alert(`Evento "${nuevoEvento.titulo}" creado. Se ha actualizado la lista.`);
    mostrarVista('lista-eventos');
}

function renderizarGestionEventos() {
    const gestionContainer = getEl('eventos-gestion-container');
    if (!gestionContainer) return;
    
    gestionContainer.innerHTML = '';
    
    if (misEventos.length === 0) {
        gestionContainer.innerHTML = '<p>Aún no has creado ningún evento.</p>';
        return;
    }
    
    for (let i = 0; i < misEventos.length; i++) {
        const evento = misEventos[i];
        
        gestionContainer.innerHTML += `
            <div class="gestion-item">
                <span>
                    <strong>${evento.titulo}</strong>
                    (Asistentes: ${evento.registrados}/${evento.cupo})
                </span>
                <div>
                    <button class="btn-notificar" onclick="notificarEvento(${evento.id})"><i class="fas fa-bell"></i> Notificar</button>
                    <button class="btn-ver-asistentes" onclick="verAsistentes(${evento.id})"><i class="fas fa-list"></i> Ver Lista</button>
                    <button class="btn-eliminar-evento" onclick="eliminarEvento(${evento.id})"><i class="fas fa-trash-alt"></i> Eliminar</button>
                </div>
            </div>
        `;
    }
}

function notificarEvento(id) {
    const evento = eventos.find(e => e.id === id);
    alert(`Simulación: Notificación enviada a los ${evento.registrados} asistentes de: ${evento.titulo}`);
}

function verAsistentes(id) {
    const evento = eventos.find(e => e.id === id);
    alert(`Simulación: Lista de asistentes para: ${evento.titulo}. (Solo se muestra en consola, ya que es una simulación)`);
    console.log(`Asistentes registrados para ${evento.titulo}:`, usuariosRegistrados.filter(u => u.rol === 'usuario'));
}

function eliminarEvento(id) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop show';
    modal.innerHTML = `
        <div class="modal-content info">
            <p id="modal-text">¿Estás seguro de que quieres eliminar este evento? Esta acción es irreversible.</p>
            <button id="modal-confirm-btn" class="modal-btn" style="background-color: #dc3545; color: white; margin-right: 10px;">Eliminar</button>
            <button id="modal-cancel-btn" class="modal-btn" style="background-color: #6c757d; color: white;">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('modal-confirm-btn').onclick = () => {
        // Eliminar evento
        eventos = eventos.filter(e => e.id !== id);
        misEventos = misEventos.filter(e => e.id !== id);
        // Cierra el modal y actualiza
        modal.classList.remove('show');
        modal.remove();
        alert(`Evento eliminado. La lista se ha actualizado.`);
        renderizarGestionEventos();
        renderizarEventos(eventos);
    };

    document.getElementById('modal-cancel-btn').onclick = () => {
        modal.classList.remove('show');
        modal.remove();
    };
}

//LÓGICA DE REGISTRO DE INFORMACIÓN ADICIONAL

function configurarFormInfo() {
    getEl('form-info').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = getEl('info-nombre').value;
        const tipo = getEl('info-tipo').value;
        
        if (nombre.trim() === '' || tipo === '') {
            alert('Completa al menos el nombre y el tipo.');
            return;
        }
        
        const nuevaInfo = {
            id: Date.now(),
            nombre: nombre,
            tipo: tipo,
            email: getEl('info-email').value || 'N/A',
            descripcion: getEl('info-descripcion').value || 'N/A',
            registradoPor: localStorage.getItem('userName') || 'Admin'
        };

        infoAdicional.push(nuevaInfo);
        localStorage.setItem('infoAdicional', JSON.stringify(infoAdicional)); // Guardar

        alert(`Información registrada (Tipo: ${tipo}, Nombre: ${nombre}).`);
        getEl('form-info').reset();
        window.location.href = "app.html";
    });
}
// Funciones de foco y desenfoque
function inputFoco(elemento) {}
function inputFuera(elemento) {}