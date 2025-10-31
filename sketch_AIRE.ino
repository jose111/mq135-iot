#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "M4";           // Tu red Wi-Fi
const char* password = "12345678";   // Contraseña Wi-Fi
String apiKey = "7VFDY45YB6Z4B4OO";           // API Key de ThingSpeak

const char* server = "http://api.thingspeak.com/update";
int mq135_pin = 34; // pin analógico donde está conectado el MQ135

void setup() {
  Serial.begin(115200);
  delay(1000);
  WiFi.begin(ssid, password);
  Serial.print("Conectando a Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado a la red Wi-Fi!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    int valorMQ = analogRead(mq135_pin);

    // Construir URL de envío
    String url = String(server) + "?api_key=" + apiKey + "&field1=" + String(valorMQ);

    http.begin(url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      Serial.println("Datos enviados correctamente!");
      Serial.println("Valor MQ135: " + String(valorMQ));
    } else {
      Serial.println("Error al enviar datos");
    }

    http.end();
  } else {
    Serial.println("Desconectado del Wi-Fi");
  }

  delay(200000); // ThingSpeak permite 1 actualización cada 15 segundos mínimo
}
