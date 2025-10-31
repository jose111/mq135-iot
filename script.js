// =========================
// CONFIGURACIÓN THINGSPEAK
// =========================
const channelID = "3140461";
const readAPIKey = "EGE8PI3NSAWXTI6X";
const fieldNum = 1;

// =========================
// VARIABLES Y ESTADO
// =========================
let chart;
let labels = [];
let valores = [];

// =========================
// FUNCIONES BASE
// =========================
async function obtenerDatos() {
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/${fieldNum}.json?api_key=${readAPIKey}&results=50`;
  const res = await fetch(url);
  const data = await res.json();
  const feeds = data.feeds || [];

  labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString());
  valores = feeds.map(f => parseFloat(f.field1));

  return feeds;
}

// =========================
// GRÁFICO CHART.JS
// =========================
async function crearGrafico() {
  const ctx = document.getElementById("graficoMQ135").getContext("2d");
  await obtenerDatos();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Nivel MQ135",
        data: valores,
        borderColor: "#0078d4",
        backgroundColor: "rgba(0,120,212,0.1)",
        borderWidth: 2,
        tension: 0.25,
        fill: true,
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// =========================
// BOT DE CALIDAD DEL AIRE
// =========================
let umbrales = JSON.parse(localStorage.getItem("umbrales")) || {
  limpio: 200,
  moderado: 400,
  peligroso: 800
};

function analizarCalidad(valor) {
  if (valor < umbrales.limpio) return "💨 Aire limpio (excelente)";
  if (valor < umbrales.moderado) return "🙂 Aire moderado (aceptable)";
  if (valor < umbrales.peligroso) return "😷 Aire contaminado (precaución)";
  return "☠️ Aire peligroso (muy mala calidad)";
}

// =========================
// ACTUALIZACIÓN EN TIEMPO REAL
// =========================
async function actualizarDatos() {
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/${fieldNum}/last.json?api_key=${readAPIKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data && data.field1) {
    const valor = parseFloat(data.field1);
    const fecha = new Date(data.created_at);

    document.getElementById("valor").textContent = valor;
    document.getElementById("comentario").textContent = analizarCalidad(valor);
    document.getElementById("fecha").textContent =
      "Última actualización: " + fecha.toLocaleString();

    if (chart) {
      chart.data.labels.push(fecha.toLocaleTimeString());
      chart.data.datasets[0].data.push(valor);
      if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update();
    }
  }
}

// =========================
// ENTRENAMIENTO DEL BOT
// =========================
const form = document.getElementById("formEntrenamiento");
const resetBot = document.getElementById("resetBot");

document.getElementById("limpio").value = umbrales.limpio;
document.getElementById("moderado").value = umbrales.moderado;
document.getElementById("peligroso").value = umbrales.peligroso;

form.addEventListener("submit", e => {
  e.preventDefault();
  umbrales = {
    limpio: parseFloat(document.getElementById("limpio").value),
    moderado: parseFloat(document.getElementById("moderado").value),
    peligroso: parseFloat(document.getElementById("peligroso").value),
  };
  localStorage.setItem("umbrales", JSON.stringify(umbrales));
  alert("🤖 Bot entrenado con nuevos umbrales personalizados.");
});

resetBot.addEventListener("click", () => {
  localStorage.removeItem("umbrales");
  umbrales = { limpio: 200, moderado: 400, peligroso: 800 };
  document.getElementById("limpio").value = 200;
  document.getElementById("moderado").value = 400;
  document.getElementById("peligroso").value = 800;
  alert("🔄 Bot restaurado a configuración por defecto.");
});

// =========================
// INICIALIZACIÓN
// =========================
(async () => {
  await crearGrafico();
  await actualizarDatos();
  setInterval(actualizarDatos, 15000);
})();
