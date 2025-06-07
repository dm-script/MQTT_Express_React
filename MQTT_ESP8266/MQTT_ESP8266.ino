#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include <TZ.h>
#include <FS.h>
#include <LittleFS.h>
#include <CertStoreBearSSL.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <ESP8266HTTPClient.h>

// WiFi Config
const char* ssid = "";
const char* password = "";

// MQTT Config
const char* mqtt_broker = "";
const char* mqtt_topic_monitor = "";
const char* mqtt_topic_control = "";
const char* mqtt_username = "";
const char* mqtt_password = "";
const int mqtt_port = 8883;

// Global Objects
BearSSL::CertStore certStore;
BearSSL::WiFiClientSecure bear;
PubSubClient mqtt_client(bear);

// Buat instance WiFiUDP dan NTPClient
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 7 * 3600, 60000); // GMT+7, update tiap 60 detik
String datetime;

// Ganti dengan alamat IP atau URL dari API kamu
const char* apiLogMysql = "http://your.API.URL/api/logSens";

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE 128
#define relayTank D1
#define relaySprinkler D2

void connectWifi() {
  delay(10);
  Serial.println();
  Serial.print("Wifi Target : ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println(" WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void setDateTime() {
  configTime("UTC+7", "pool.ntp.org", "time.nist.gov");  // WIB (UTC+7)

  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(100);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println();

  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.printf("%s %s", tzname[0], asctime(&timeinfo));
}

void connectBrokerMQTT() {
  while (!mqtt_client.connected()) {
    Serial.print("Attempting MQTT connection…");
    String client_id = "ESP8266Client-" + String(ESP.getChipId());
    if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Connected to MQTT broker");
      mqtt_client.subscribe(mqtt_topic_control);
      //mqtt_client.publish(mqtt_topic_monitor, "Hi MQTT I'm ESP8266 ^^");
    } else {
      Serial.print("Failed to connect to MQTT broker, rc=");
      Serial.print(mqtt_client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callbackMQTT(char* topic, byte* payload, unsigned int length) {
  Serial.println();
  Serial.println("Control Signal..!!!");

  char jsonStr[length + 1];
  memcpy(jsonStr, payload, length);
  jsonStr[length] = '\0';

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, jsonStr);

  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.f_str());
    return;
  }

  if (doc.containsKey("pumpTank")) {
    if (doc["pumpTank"].as<int>() == 1) {
      Serial.println("Pompa Tangki : ON"); Serial.println("");
      digitalWrite(relayTank, HIGH);
    } else {
      Serial.println("Pompa Tangki : OFF"); Serial.println("");
      digitalWrite(relayTank, LOW);
    }
  }

  if (doc.containsKey("pumpSprinkler")) {
    if (doc["pumpSprinkler"].as<int>() == 1) {
      Serial.println("Pompa Sprinkler : ON"); Serial.println("");
      digitalWrite(relaySprinkler, HIGH);
    } else {
      Serial.println("Pompa Sprinkler : OFF"); Serial.println("");
      digitalWrite(relaySprinkler, LOW);
    }
  }

  // if (doc.containsKey("speedFan")) {
  //   Serial.print("Kecepatan Motor : ");
  //   Serial.println(doc["speedFan"].as<int>());
  // }
}

void setup() {
  delay(500);
  Serial.begin(115200);
  delay(500);

  pinMode(relayTank, OUTPUT);
  pinMode(relaySprinkler, OUTPUT);

  LittleFS.begin();
  connectWifi();
  setDateTime();
  timeClient.begin();

  int numCerts = certStore.initCertStore(LittleFS, PSTR("/certs.idx"), PSTR("/certs.ar"));
  Serial.printf("Number of CA certs read: %d\n", numCerts);
  if (numCerts == 0) {
    Serial.println("No certs found.");
    Serial.println("Did you run certs-from-mozilla.py and upload the LittleFS directory before running?");
    return; // Stop program, cannot verify TLS
  }

  bear.setCertStore(&certStore);  // Use certStore with TLS connection

  mqtt_client.setServer(mqtt_broker, mqtt_port);
  mqtt_client.setCallback(callbackMQTT);
  connectBrokerMQTT();
}

void loop() {
  if (!mqtt_client.connected()) {
    connectBrokerMQTT();
  }

  mqtt_client.loop();
  timeClient.update();

  HTTPClient http;
  WiFiClient client;

  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;

    // Generate data acak
    int suhu = random(20, 100); // suhu antara 20–30
    int klmb = random(20, 100);  // kelembapan antara 50–80
    datetime = timeClient.getFormattedTime();

    //Rentang lebar tampilan web terpotong jadi 85%
    int precentage_suhu = map(suhu, 0, 100, 0, 85); 

    //Rentang lebar tampilan web terpotong jadi 85%
    int precentage_klmb = map(klmb, 0, 100, 0, 85);

    // Buat JSON
    StaticJsonDocument<128> doc;
    doc["stateTank"] = digitalRead(relayTank);
    doc["stateSprinkler"] = digitalRead(relaySprinkler);
    doc["temp"] = suhu;
    doc["hum"] = klmb;
    doc["ps_temp"] = precentage_suhu;
    doc["ps_hum"] = precentage_klmb;
    doc["datetime"] = datetime;

    char msg[MSG_BUFFER_SIZE];
    serializeJson(doc, msg);
    mqtt_client.publish(mqtt_topic_monitor, msg);

    Serial.print("Publish message: ");
    Serial.println(msg);

    String dataMysql = "{\"hum\": " + String(klmb) + ", \"temp\": " + String(suhu) + "}";

    http.begin(client, apiLogMysql);
    http.addHeader("Content-Type", "application/json");

    int httpResponseMysql = http.POST(dataMysql);

    Serial.print("Mengirim data: ");
    Serial.println(dataMysql);
    Serial.print("Status response: ");
    Serial.println(httpResponseMysql);
    Serial.println("--------------------------");
  }
}
