// Todo el contenido personalizable está aquí.
window.CONFIG = {
  herName: "Melanie",
  fromName: "Luka",

  // Fecha del aniversario (se muestra arriba)
  date: "2026-10-27",

  // Fecha en que empezaron (activa el contador). Déjalo en null para ocultarlo.
  startDate: "2024-11-27T00:00:00",

  // Foto grande de portada y foto del cierre
  heroPhoto: "assets/fotos/portada.jpg",
  endingPhoto: "assets/fotos/luces.jpg",

  // Frase bajo la portada
  quote: "De todas mis historias, tú eres mi favorita.",

  // Galería. La leyenda es opcional.
  photos: [
    { src: "assets/fotos/palmeras.jpg", caption: "Tú y yo bajo el cielo" },
    { src: "assets/fotos/abrazo.jpg", caption: "Mi lugar seguro" },
    { src: "assets/fotos/noche.jpg", caption: "Noches contigo" },
    { src: "assets/fotos/luces.jpg", caption: "Mi mejor regalo" },
  ],

  // Carta: cada elemento es un párrafo.
  letter: [
    "Mi amor:",
    "Aquí irán las palabras que te quiero decir. Este texto es provisional hasta tener la carta definitiva.",
    "Gracias por cada día a tu lado.",
  ],

  // Tarjeta para raspar: cada 24 h sale uno al azar. [] = se oculta.
  scratch: [
    "Eres lo más bonito que me ha pasado ♥",
    "Hoy te debo un beso extra largo",
    "Vale por un abrazo de esos que curan todo",
    "Si pudiera elegir de nuevo, te elegiría mil veces",
    "Tu sonrisa es mi lugar favorito",
    "Hoy invito yo: tú eliges el antojo",
    "Eres mi persona favorita en todo el mundo",
    "Contigo hasta los días grises son bonitos",
    "Vale por una cita sorpresa conmigo",
    "Me haces feliz de formas que no sé explicar",
    "Gracias por quedarte, por elegirme, por ser tú",
    "Hoy te toca un masaje sin reclamos",
    "Cada día te quiero un poquito más que ayer",
    "Eres mi casualidad más bonita",
    "Vale por una noche de pelis y abrazos",
    "Mi corazón es tuyo, hoy y siempre",
  ],

  // Vales de amor (se voltean al tocarlos). [] = se oculta.
  coupons: [
    { title: "Un abrazo infinito", note: "Canjeable cuando quieras" },
    { title: "Una cena hecha por mí", note: "Tú eliges el menú" },
    { title: "Maratón de pelis", note: "Con tus snacks favoritos" },
    { title: "Un día de sí a todo", note: "Sin quejas, lo prometo" },
  ],

  // Canción opcional (mp3 en assets/musica/). null = sin música.
  music: "assets/musica/sparks.mp3",
};
