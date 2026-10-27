// Todo el contenido personalizable está aquí.
window.CONFIG = {
  herName: "Melany",
  // Firma al final de la carta y de la página (nombre del cliente)
  signature: "Con todo mi amor, tu amor",

  // Fecha del aniversario (se muestra arriba)
  date: "2026-10-27",

  // Fecha en que empezaron (activa el contador). Déjalo en null para ocultarlo.
  startDate: null, // ej: "2023-10-27T00:00:00"

  // Fotos en assets/fotos/. La leyenda es opcional.
  photos: [
    { src: "assets/fotos/1.jpg", caption: "Nuestro primer recuerdo" },
    { src: "assets/fotos/2.jpg", caption: "Tú y yo" },
    { src: "assets/fotos/3.jpg", caption: "Mi lugar favorito" },
    { src: "assets/fotos/4.jpg", caption: "Siempre juntos" },
  ],

  // Carta: cada elemento es un párrafo.
  letter: [
    "Mi amor:",
    "Aquí irán las palabras que te quiero decir. Este texto es provisional hasta tener la carta definitiva.",
    "Gracias por cada día a tu lado.",
  ],

  // Tarjetas que se voltean. Déjalo vacío [] para ocultar la sección.
  reasons: [
    "Tu sonrisa",
    "Cómo me cuidas",
    "Tus abrazos",
    "Que eres mi hogar",
  ],

  // Canción opcional (mp3 en assets/musica/). null = sin música.
  music: null, // ej: "assets/musica/cancion.mp3"
};
