// Cuando el input tiene el foco
function inputFoco(elemento) {
  elemento.style.borderColor = "#3366cc";
}

// Cuando el input pierde el foco
function inputFuera(elemento) {
  elemento.style.borderColor = "#ccc";
}

// Validar inicio de sesión
function validarLogin() {
  var usuario = document.getElementById("usuario").value.trim();
  var clave = document.getElementById("clave").value.trim();

  // Expresión regular para validar correo electrónico
  var formatoCorreo = /\S+@\S+\.\S+/;

  if (usuario == "" || clave == "") {
    alert("Por favor, completa todos los campos.");
    return false;
  }

  // Si el usuario contiene '@', lo tratamos como correo y lo validamos
  if (usuario.includes("@")) {
    if (!formatoCorreo.test(usuario)) {
      alert("El correo ingresado no es válido. Ejemplo: usuario@gmail.com");
      return false;
    }
  }

  // Validación de contraseña
  if (clave.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return false;
  }

  alert("Inicio de sesión correcto.");
  window.location.href = "panel.html";
  return false;
}
