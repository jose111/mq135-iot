const channelID = "3140461";
const readAPIKey = "EGE8PI3NSAWXTI6X";
const fieldNum = 1;

async function actualizarDatos() {
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/${fieldNum}/last.json?api_key=${readAPIKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.field1) {
      const valor = parseFloat(data.field1);
      const fecha = new Date(data.created_at);

      const mensajeBot = analizarEstadoSensor(valor, fecha);

      document.getElementById("valor").textContent = valor;
      document.getElementById("comentario").textContent = mensajeBot;
      document.getElementById("fecha").textContent =
        "Última actualización: " + fecha.toLocaleString();
    }
  } catch (error) {
    document.getElementById("valor").textContent = "—";
    document.getElementById("comentario").textContent = "⚠️ Error obteniendo datos";
    document.getElementById("fecha").textContent = "";
    console.error("Error obteniendo datos:", error);
  }
}

// Inicialización
actualizarDatos();
setInterval(actualizarDatos, 180000); // cada 3 minutos
