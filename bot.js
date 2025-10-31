let valorAnterior = null;
let tendencia = "estable";
let historialLecturas = [];
const maxHistorial = 20; // memoria de las últimas lecturas

function analizarEstadoSensorInteligente(valor, fechaLectura) {
  const ahora = new Date();
  const ultimaLectura = new Date(fechaLectura);
  const diferencia = (ahora - ultimaLectura) / 1000; // segundos

  // ===== DETECCIÓN DE SENSOR DESCONECTADO =====
  // Si no hay datos recientes o valor fuera de rango típico
  if (diferencia > 600 || valor === 0 || valor > 1500 || isNaN(valor)) {
    return "⚠️ Sensor desconectado o valor inválido";
  }

  // ===== MEMORIA Y PROMEDIO =====
  historialLecturas.push(valor);
  if (historialLecturas.length > maxHistorial) historialLecturas.shift();
  const promedio = historialLecturas.reduce((a,b)=>a+b,0)/historialLecturas.length;

  // ===== DETECCIÓN DE CAMBIOS BRUSCOS =====
  let alerta = "";
  if (valor > promedio + 100) alerta = "⚠️ Aumento brusco de contaminación detectado.";

  // ===== DETERMINACIÓN DE TENDENCIA =====
  if (valorAnterior !== null) {
    if (valor > valorAnterior + 20) tendencia = "subiendo";
    else if (valor < valorAnterior - 20) tendencia = "bajando";
    else tendencia = "estable";
  }
  valorAnterior = valor;

  // ===== EVALUACIÓN DE CALIDAD DEL AIRE =====
  let comentario = "";
  if (valor < 200) comentario = "💨 Aire limpio y fresco.";
  else if (valor < 400) comentario = "🙂 Aire aceptable, sin riesgo inmediato.";
  else if (valor < 800) comentario = "😷 Aire contaminado, ventila el ambiente.";
  else comentario = "☠️ Aire muy peligroso. Evita exposición prolongada.";

  // Ajustar mensaje según tendencia
  if (tendencia === "subiendo") comentario += " Empeorando en los últimos minutos.";
  else if (tendencia === "bajando") comentario += " Mejorando en los últimos minutos.";

  return `✅ Sensor conectado • ${comentario} ${alerta}`;
}
