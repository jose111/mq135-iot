// Configura tu canal de ThingSpeak
const channelID = "TU_CHANNEL_ID"; // 👈 Reemplaza con tu canal
const fieldNum = 1; // Si usaste field1

async function actualizarDato() {
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/${fieldNum}/last.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("valor").textContent = data.field1;
    document.getElementById("fecha").textContent =
      "Última actualización: " + new Date(data.created_at).toLocaleString();
  } catch (err) {
    document.getElementById("valor").textContent = "Error al cargar";
    console.error("Error al obtener datos:", err);
  }
}

// Actualiza al cargar la página y cada 15 segundos
actualizarDato();
setInterval(actualizarDato, 15000);
