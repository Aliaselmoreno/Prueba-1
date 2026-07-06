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

// Nosotros tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach((panel) => panel.classList.remove('is-active'));

    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('is-active');
  });
});

// Contact form -> sends the request straight to WhatsApp with a prefilled message.
// Routed to the business WhatsApp for empresa/vehículo services, particulares otherwise.
const WHATSAPP_PARTICULARES = '34635421689';
const WHATSAPP_EMPRESAS = '34611892866';
const EMPRESA_SERVICIOS = ['empresa', 'vehiculo'];

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

  const whatsappNumber = EMPRESA_SERVICIOS.includes(servicio) ? WHATSAPP_EMPRESAS : WHATSAPP_PARTICULARES;

  const text =
    `Hola Limpieza Tapicerías Salva, soy ${nombre}.%0A` +
    `Teléfono: ${telefono}%0A` +
    `Email: ${email}%0A` +
    `Servicio: ${servicio}%0A` +
    `Mensaje: ${mensaje || '-'}`;

  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');

  status.textContent = 'Te hemos redirigido a WhatsApp para confirmar tu solicitud.';
  form.reset();
});
