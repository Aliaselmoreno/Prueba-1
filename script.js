// Gimnàs Al-Moo-Kwan Sueca — interacciones básicas

document.addEventListener('DOMContentLoaded', () => {

  // Año actual en el pie de página
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Menú de navegación en móvil
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Slider del tour (portada)
  document.querySelectorAll('.slider').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    if (slides.length === 0) return;

    const dotsWrap = slider.querySelector('.slider-dots');
    const interval = parseInt(slider.dataset.autoplay, 10) || 5000;
    let current = slides.findIndex((s) => s.classList.contains('is-active'));
    if (current < 0) current = 0;
    let timer = null;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), interval);
    }

    slider.querySelector('.prev').addEventListener('click', () => { goTo(current - 1); restart(); });
    slider.querySelector('.next').addEventListener('click', () => { goTo(current + 1); restart(); });
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);

    dots[current].classList.add('is-active');
    restart();
  });

});
