// Año actual en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navegación móvil
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// Cerrar menú al pulsar un enlace
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Sombra en el header al hacer scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Animación de aparición al hacer scroll
const revealEls = document.querySelectorAll(
  '.card, .step, .zone, .quote, .about__media, .about__content, .section__head, .contact__info, .contact__form, .trust__item'
);
revealEls.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// Formulario de contacto
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailOk) {
    note.textContent = 'Por favor, indica tu nombre y un email válido.';
    note.className = 'form__note error';
    return;
  }

  // Envío por WhatsApp con los datos del formulario
  const goal = form.goal.value ? `\nObjetivo: ${form.goal.value}` : '';
  const phone = form.phone.value.trim() ? `\nTeléfono: ${form.phone.value.trim()}` : '';
  const msg = form.message.value.trim() ? `\nMensaje: ${form.message.value.trim()}` : '';
  const text = encodeURIComponent(
    `¡Hola Dietofit! Soy ${name}.\nEmail: ${email}${phone}${goal}${msg}`
  );

  note.textContent = '¡Gracias! Te redirijo a WhatsApp para completar el envío...';
  note.className = 'form__note success';
  setTimeout(() => {
    window.open(`https://wa.me/34691650475?text=${text}`, '_blank');
    form.reset();
  }, 900);
});
