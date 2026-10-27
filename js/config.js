// Todo el contenido personalizable está aquí.
window.CONFIG = {
  herName: "Melany",
  fromName: "Luka",

  // Fecha del aniversario (se muestra arriba)
  date: "2026-10-27",

  // Fecha en que empezaron (activa el contador). Déjalo en null para ocultarlo.
  startDate: null, // ej: "2025-10-27T00:00:00"

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

  // Tarjeta para raspar. null = se oculta.
  scratch: "Vale por una cita sorpresa conmigo ♥",

  // Vales de amor (se voltean al tocarlos). [] = se oculta.
  coupons: [
    { title: "Un abrazo infinito", note: "Canjeable cuando quieras" },
    { title: "Una cena hecha por mí", note: "Tú eliges el menú" },
    { title: "Maratón de pelis", note: "Con tus snacks favoritos" },
    { title: "Un día de sí a todo", note: "Sin quejas, lo prometo" },
  ],

  // Canción opcional (mp3 en assets/musica/). null = sin música.
  music: null, // ej: "assets/musica/cancion.mp3"
};
