// Referencias
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnLogout = document.getElementById('btn-logout');
const btnVerPublicaciones = document.getElementById('btn-ver-publicaciones');
const btnPublicar = document.getElementById('btn-publicar');

const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const formPublicacion = document.getElementById('form-publicacion');
const seccionVer = document.getElementById('ver-publicaciones');
const listaPublicaciones = document.getElementById('lista-publicaciones');
const publicacionesContainer = document.getElementById('publicaciones-container');

// Datos locales
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let publicaciones = JSON.parse(localStorage.getItem('publicaciones')) || [];
let usuarioActivo = localStorage.getItem('usuarioActivo');

// Mostrar publicaciones de todos los usuarios en la página principal
function mostrarPublicaciones() {
  publicacionesContainer.innerHTML = '';
  publicaciones.forEach(pub => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <img src="${pub.imagen}" alt="Imagen de propiedad">
      <h3>${pub.titulo}</h3>
      <p><strong>Precio:</strong> RD$${pub.precio}</p>
      <p><strong>Tipo:</strong> ${pub.tipo}</p>
      <p><strong>Estado:</strong> ${pub.disponibilidad === 'disponible' ? '🟢 Disponible' : '🔴 No disponible'}</p>
      <small><em>Publicado por: ${pub.usuario}</em></small>
    `;
    publicacionesContainer.appendChild(div);
  });
}
mostrarPublicaciones();

// Mostrar formulario de publicación solo si hay sesión
btnPublicar.addEventListener('click', () => {
  if (!usuarioActivo) return alert("Debe iniciar sesión para publicar.");
  formPublicacion.classList.toggle('hidden');
  seccionVer.classList.add('hidden');
});

// Guardar nueva publicación
document.getElementById('publicar-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!usuarioActivo) return alert("Debe iniciar sesión para publicar.");

  const titulo = document.getElementById('titulo').value;
  const precio = document.getElementById('precio').value;
  const tipo = document.getElementById('tipo').value;
  const descripcion = document.getElementById('descripcion').value;
  const disponibilidad = document.getElementById('disponibilidad').value;
  const imagen = document.getElementById('imagen-subida').files[0];

  if (!imagen) return alert("Debe subir una imagen.");

  const reader = new FileReader();
  reader.onload = function() {
    const nuevaPublicacion = {
      usuario: usuarioActivo,
      titulo,
      precio,
      tipo,
      descripcion,
      disponibilidad,
      imagen: reader.result
    };
    publicaciones.push(nuevaPublicacion);
    localStorage.setItem('publicaciones', JSON.stringify(publicaciones));
    mostrarPublicaciones();
    alert("✅ Publicación guardada correctamente");
    document.getElementById('publicar-form').reset();
    formPublicacion.classList.add('hidden');
  };
  reader.readAsDataURL(imagen);
});

// Ver publicaciones del usuario actual
btnVerPublicaciones.addEventListener('click', () => {
  if (!usuarioActivo) return alert("Debe iniciar sesión para ver sus publicaciones.");

  listaPublicaciones.innerHTML = '';
  const publicacionesUsuario = publicaciones.filter(pub => pub.usuario === usuarioActivo);

  if (publicacionesUsuario.length === 0) {
    listaPublicaciones.innerHTML = "<p>No tienes publicaciones aún.</p>";
  } else {
    publicacionesUsuario.forEach((pub, index) => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
        <img src="${pub.imagen}" alt="Imagen de propiedad">
        <h3>${pub.titulo}</h3>
        <p><strong>Precio:</strong> RD$${pub.precio}</p>
        <p><strong>Tipo:</strong> ${pub.tipo}</p>
        <p><strong>Descripción:</strong> ${pub.descripcion}</p>
        <p><strong>Estado:</strong> ${pub.disponibilidad === 'disponible' ? '🟢 Disponible' : '🔴 No disponible'}</p>
        <button class="eliminar" data-index="${index}">🗑 Eliminar</button>
      `;
      listaPublicaciones.appendChild(div);
    });

    // Eventos de eliminación solo para publicaciones del usuario actual
    document.querySelectorAll('.eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        const publicacionesUsuario = publicaciones.filter(pub => pub.usuario === usuarioActivo);
        const publicacionAEliminar = publicacionesUsuario[index];
        const indiceGlobal = publicaciones.findIndex(p => 
          p.usuario === publicacionAEliminar.usuario && p.titulo === publicacionAEliminar.titulo
        );

        if (indiceGlobal > -1) {
          publicaciones.splice(indiceGlobal, 1);
          localStorage.setItem('publicaciones', JSON.stringify(publicaciones));
          mostrarPublicaciones();
          btnVerPublicaciones.click();
        }
      });
    });
  }

  seccionVer.classList.toggle('hidden');
});

// Registro
document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (usuarios.find(u => u.email === email)) return alert("Ese correo ya está registrado.");

  usuarios.push({ nombre, email, password });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  alert("✅ Registro exitoso, ahora puede iniciar sesión.");
  registerSection.classList.add('hidden');
});

// Inicio de sesión
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) return alert("Credenciales incorrectas.");

  usuarioActivo = email;
  localStorage.setItem('usuarioActivo', usuarioActivo);
  actualizarUI();
  alert(`👋 Bienvenido ${usuario.nombre}`);
  loginSection.classList.add('hidden');
});

// Cerrar sesión
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  usuarioActivo = null;
  actualizarUI();
  alert("Sesión cerrada.");
});

// Actualiza la interfaz según si hay sesión
function actualizarUI() {
  const autenticado = !!usuarioActivo;
  btnLogin.classList.toggle('hidden', autenticado);
  btnRegister.classList.toggle('hidden', autenticado);
  btnLogout.classList.toggle('hidden', !autenticado);
  btnVerPublicaciones.classList.toggle('hidden', !autenticado);
  btnPublicar.classList.toggle('hidden', !autenticado);
}
actualizarUI();

// Mostrar/ocultar formularios de autenticación
btnLogin.addEventListener('click', () => {
  loginSection.classList.toggle('hidden');
  registerSection.classList.add('hidden');
});
btnRegister.addEventListener('click', () => {
  registerSection.classList.toggle('hidden');
  loginSection.classList.add('hidden');
});









