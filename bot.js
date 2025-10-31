// =========================
// BOT INTEGRAL: calidad + tendencia + sensor
// =========================
let valorAnterior = null;
let tendencia = "estable";

/**
 * Analiza la lectura del sensor y devuelve un comentario inteligente
 * @param {number} valor - Valor actual del MQ135
 * @param {string|Date} fechaLectura - Fecha de la última lectura
 * @returns {string} Comentario del bot
 */
function analizarEstadoSensor(valor, fechaLectura) {
  const ahora = new Date();
  const ultimaLectura = new Date(fechaLectura);
  const diferencia = (ahora - ultimaLectura) / 1000; // en segundos

  // Verificar conexión del sensor
  if (diferencia > 600) { // 10 minutos sin datos
    return "⚠️ Sensor desconectado o sin datos recientes";
  }

  // Determinar tendencia
  if (valorAnterior !== null) {
    if (valor > valorAnterior + 20) tendencia = "subiendo";
    else if (valor < valorAnterior - 20) tendencia = "bajando";
    else tendencia = "estable";
  }
  valorAnterior = valor;

  // Evaluación de la calidad del aire
  let comentario = "";
  if (valor < 200) {
    comentario = "💨 Aire limpio y fresco.";
    if (tendencia === "bajando") comentario += " La calidad está mejorando.";
    else if (tendencia === "subiendo") comentario += " Ligero aumento detectado.";
  } else if (valor < 400) {
    comentario = "🙂 Aire aceptable, sin riesgo inmediato.";
    if (tendencia === "subiendo") comentario += " Posible incremento leve en contaminación.";
  } else if (valor < 800) {
    comentario = "😷 Aire contaminado, ventila el ambiente.";
    if (tendencia === "bajando") comentario += " Parece estar mejorando.";
  } else {
    comentario = "☠️ Aire muy peligroso. Evita exposición prolongada.";
    if (tendencia === "bajando") comentario += " La calidad comienza a mejorar.";
  }

  return `✅ Sensor conectado • ${comentario}`;
}
