#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "HabibiGarden";   // Replace with your Wi-Fi SSID
const char* password = "Prodigy123";    // Replace with your Wi-Fi Password

// MQTT settings
const char* broker = "test.mosquitto.org"; // MQTT broker address
const int broker_port = 1883; // MQTT port
const char* mqtt_username = "";  // Leave empty if not required
const char* mqtt_password = "";  // Leave empty if not required

// MQTT Topics
const char* lamp_topic = "rahmad/lamp";
const char* sprayer_topic = "rahmad/spray";

// Pin assignments
const int lampPin = 13;   // GPIO 13 for lamp (LED)
const int sprayerPin = 14; // GPIO 14 for sprayer (LED)

// MQTT client
WiFiClient espClient;
PubSubClient client(espClient);

// Function to connect to Wi-Fi
void setup_wifi() {
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    int retry_count = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        retry_count++;
        if (retry_count >= 20) { // Try 20 times before restarting
            Serial.println("Failed to connect to Wi-Fi, restarting...");
            ESP.restart();
        }
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

// Callback function to handle incoming MQTT messages
void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    String message;
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.print("Message: ");
    Serial.println(message);

    if (String(topic) == lamp_topic) {
        if (message == "ON") {
            Serial.println("Turning Lamp ON");
            digitalWrite(lampPin, HIGH);
        } else if (message == "OFF") {
            Serial.println("Turning Lamp OFF");
            digitalWrite(lampPin, LOW);
        }
    } else if (String(topic) == sprayer_topic) {
        if (message == "ON") {
            Serial.println("Turning Sprayer ON");
            digitalWrite(sprayerPin, HIGH);
        } else if (message == "OFF") {
            Serial.println("Turning Sprayer OFF");
            digitalWrite(sprayerPin, LOW);
        }
    }
}

// Function to reconnect to the MQTT broker
void reconnect() {
    // Loop until we're reconnected
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        // Create a random client ID
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);

        // Attempt to connect
        if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("connected");
            // Subscribe to topics
            client.subscribe(lamp_topic);
            client.subscribe(sprayer_topic);
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

// Setup function
void setup() {
    Serial.begin(115200);
    Serial.println("Setup starting...");

    // Initialize pins
    pinMode(lampPin, OUTPUT);
    pinMode(sprayerPin, OUTPUT);

    // Connect to Wi-Fi
    setup_wifi();

    // Set up MQTT client
    client.setServer(broker, broker_port);
    client.setCallback(callback);
    Serial.println("MQTT client setup complete");
}

// Loop function
void loop() {
    if (!client.connected()) {
        Serial.println("MQTT client not connected. Reconnecting...");
        reconnect();
    }
    client.loop();

    delay(2000); // Delay between MQTT operations
}
