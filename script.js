document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(15,23,42,0.08)' : 'none';
});

// Contact form -> sends the request straight to WhatsApp with a prefilled message
const WHATSAPP_NUMBER = '34600000000'; // TODO: replace with the real number, digits only, country code first

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const nombre = data.get('nombre');
  const telefono = data.get('telefono');
  const email = data.get('email');
  const servicio = data.get('servicio');
  const mensaje = data.get('mensaje');

  const text =
    `Hola Salva Limpieza, soy ${nombre}.%0A` +
    `Teléfono: ${telefono}%0A` +
    `Email: ${email}%0A` +
    `Servicio: ${servicio}%0A` +
    `Mensaje: ${mensaje || '-'}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');

  status.textContent = 'Te hemos redirigido a WhatsApp para confirmar tu solicitud.';
  form.reset();
});
