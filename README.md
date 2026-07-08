# Gimnàs Al-Moo-Kwan Sueca — Página web

Página web estática del gimnasio: no necesita servidor ni instalación, basta con abrir `index.html` en el navegador o subir todos los archivos a cualquier hosting.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: tour por las instalaciones, resumen de actividades y contacto |
| `actividades.html` | Las 8 actividades con su descripción |
| `horarios-y-precios.html` | Bonos, precios y horario de oficina |
| `preguntas-frecuentes-faq.html` | Preguntas Frecuentes (FAQ) |

## Cómo poner las fotos reales

Las imágenes actuales son **marcadores de posición** (archivos SVG). Para usar las fotos reales del gimnasio, sustituye cada archivo por la foto correspondiente:

**Portada (tour):** carpeta `images/tour/`

- `sala-taekwondo-1.svg` → foto de la sala de taekwondo (suelo azul, banderas)
- `sala-taekwondo-2.svg` → segunda foto de la sala de taekwondo
- `sala-actividades.svg` → sala con fitballs
- `tatami.svg` → sala con tatami
- `sala-musculacion.svg` → sala de musculación

**Actividades:** carpeta `images/actividades/`

- `yoga.svg`, `crosstraining.svg`, `taekwondo.svg`, `aerobic.svg`, `spinning.svg`, `musculacion.svg`, `kickboxing.svg`, `pilates.svg`

> Consejo: si las fotos son `.jpg`, lo más sencillo es cambiar la extensión en los `src="images/..."` de los HTML (por ejemplo `images/tour/sala-taekwondo-1.jpg`). Las fotos se recortan automáticamente al hueco (formato 16:9 recomendado).

## Datos de contacto usados

- Dirección: C/ Patilots Nº110, 46410 Sueca (Valencia)
- Teléfonos: 662 547 650 / 608 344 264
- Correo: avalosgym@hotmail.com
- Oficina: lunes a viernes de 17:00 a 20:15
- Redes: Instagram (@gymamksueca), YouTube (@Almookwansueca-gym), Facebook (almookwansueca)
