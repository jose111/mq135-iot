// =========================
// CONFIGURACIÓN THINGSPEAK
// =========================
const channelID = "3140461";
const readAPIKey = "EGE8PI3NSAWXTI6X";
const fieldNum = 1;

// =========================
// ESTADO DEL BOT
// =========================
let valorAnterior = null;
let tendencia = "estable";

// =========================
// BOT INTELIGENTE DE CALIDAD DEL AIRE
// =========================
function analizarCalidad(valor) {
  // Determinar tendencia
  if (valorAnterior !== null) {
    if (valor > valorAnterior + 20) tendencia = "subiendo";
    else if (valor < valorAnterior - 20) tendencia = "bajando";
    else tendencia = "estable";
  }
  valorAnterior = valor;

  // Evaluación del aire
  let comentario = "";
  if (valor < 200) {
    comentario = "💨 Aire limpio y fresco.";
    if (tendencia === "bajando") comentario += " La calidad está mejorando.";
    else if (tendencia === "subiendo") comentario += " Ligero aumento en partículas.";
  } 
  else if (valor < 400) {
    comentario = "🙂 Aire aceptable, sin riesgo inmediato.";
    if (tendencia === "subiendo") comentario += " Posible incremento leve en contaminación.";
  } 
  else if (valor < 800) {
    comentario = "😷 Aire contaminado, evita espacios cerrados sin ventilación.";
    if (tendencia === "bajando") comentario += " Parece estar mejorando.";
  } 
  else {
    comentario = "☠️ Aire muy peligroso. Mantente en interiores si es posible.";
    if (tendencia === "bajando") comentario += " Pero la calidad empieza a mejorar.";
  }

  return comentario;
}

// =========================
// ACTUALIZAR DATOS DESDE THINGSPEAK
// =========================
async function actualizarDatos() {
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/${fieldNum}/last.json?api_key=${readAPIKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.field1) {
      const valor = parseFloat(data.field1);
      const fecha = new Date(data.created_at);

      document.getElementById("valor").textContent = valor;
      document.getElementById("comentario").textContent = analizarCalidad(valor);
      document.getElementById("fecha").textContent =
        "Última actualización: " + fecha.toLocaleString();
    }
  } catch (error) {
    document.getElementById("valor").textContent = "Error";
    document.getElementById("comentario").textContent = "No se pudieron obtener los datos.";
    console.error("Error obteniendo datos:", error);
  }
}

// =========================
// INICIALIZACIÓN
// =========================
actualizarDatos();
setInterval(actualizarDatos, 180000); // 🔁 cada 3 minutos
