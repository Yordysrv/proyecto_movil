// Elementos DOM
const loginBtn = document.getElementById('btn-login');
const registerBtn = document.getElementById('btn-register');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const publicarBtn = document.getElementById('btn-publicar');
const formPublicacion = document.getElementById('form-publicacion');
const publicacionesContainer = document.getElementById('publicaciones-container');

let usuarioAutenticado = false;
let pagoRealizado = false;

// Mostrar formularios de autenticación
loginBtn.addEventListener('click', () => {
  loginSection.classList.remove('hidden');
  registerSection.classList.add('hidden');
});

registerBtn.addEventListener('click', () => {
  registerSection.classList.remove('hidden');
  loginSection.classList.add('hidden');
});

// Manejo de formularios de autenticación (simulación)
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Sesión iniciada correctamente');
  usuarioAutenticado = true;
  ocultarAuthForms();
});

document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Usuario registrado correctamente');
  usuarioAutenticado = true;
  ocultarAuthForms();
});

// Ocultar formularios de login/registro
function ocultarAuthForms() {
  loginSection.classList.add('hidden');
  registerSection.classList.add('hidden');
}

// Simulación de pago antes de mostrar el formulario de publicación
publicarBtn.addEventListener('click', () => {
  if (!usuarioAutenticado) {
    alert('Debe iniciar sesión para publicar.');
    return;
  }

  if (!pagoRealizado) {
    const confirmarPago = confirm('Debe realizar un pago único para publicar. ¿Desea continuar?');
    if (confirmarPago) {
      // Aquí deberías integrar una pasarela de pago real
      pagoRealizado = true;
      alert('Pago realizado con éxito. Ahora puedes publicar.');
      formPublicacion.classList.remove('hidden');
    }
  } else {
    formPublicacion.classList.toggle('hidden');
  }
});

// Manejo de formulario de publicación
document.getElementById('publicar-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const imagenes = document.getElementById('imagen-subida').files;
  if (imagenes.length > 5) {
    alert('Solo se permiten 5 imágenes máximo.');
    return;
  }

  alert('Publicación exitosa. Será visible por 90 días.');
  agregarPublicacionDemo();
  formPublicacion.classList.add('hidden');
});

// Agregar una publicación de prueba al contenedor
function agregarPublicacionDemo() {
  const card = document.createElement('div');
  card.style.border = '1px solid #ccc';
  card.style.padding = '10px';
  card.style.borderRadius = '8px';
  card.innerHTML = `
    <h3>📌 Propiedad Publicada</h3>
    <p>Descripción de ejemplo...</p>
    <p><strong>Contacto:</strong> <a href="https://wa.me/" target="_blank">WhatsApp</a></p>
  `;
  publicacionesContainer.appendChild(card);
}






