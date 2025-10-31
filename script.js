const channelID = "3140461";              // Tu canal
const readAPIKey = "EGE8PI3NSAWXTI6X";    // Tu Read API Key
const fieldNum = 1;                       // Campo que estás usando en ThingSpeak

async function actualizarDato() {
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/${fieldNum}/last.json?api_key=${readAPIKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("Datos obtenidos:", data); // Para depurar

    if (data && data.field1) {
      document.getElementById("valor").textContent = data.field1;
      if (data.created_at) {
        const fecha = new Date(data.created_at);
        document.getElementById("fecha").textContent =
          "Última actualización: " + (isNaN(fecha) ? "Sin fecha válida" : fecha.toLocaleString());
      } else {
        document.getElementById("fecha").textContent = "Sin fecha disponible";
      }
    } else {
      document.getElementById("valor").textContent = "Sin datos";
      document.getElementById("fecha").textContent = "";
    }
  } catch (err) {
    document.getElementById("valor").textContent = "Error al cargar";
    console.error("Error al obtener datos:", err);
  }
}

actualizarDato();
setInterval(actualizarDato, 15000);

