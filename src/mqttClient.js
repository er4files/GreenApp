import Paho from 'paho-mqtt';

const broker = 'ws://test.mosquitto.org:8080/mqtt';

class MqttClient {
  constructor() {
    this.client = new Paho.Client(broker, 'clientId-' + Math.random().toString(16).substr(2, 8));
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);

    // Callbacks for sensor updates
    this.onPhUpdate = null;
    this.onTempUpdate = null;
    this.onHumUpdate = null;
    this.onNutUpdate = null;
  }

  connect() {
    const options = {
      onSuccess: this.onConnect.bind(this),
      onFailure: this.onFailure.bind(this),
    };
    this.client.connect(options);
  }

  onConnect() {
    console.log('Connected to MQTT broker');
    this.client.subscribe('rahmad/ph');
    this.client.subscribe('rahmad/temp');
    this.client.subscribe('rahmad/hum');
    this.client.subscribe('rahmad/nut');
  }

  onFailure(error) {
    console.error('Failed to connect: ' + error.errorMessage);
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.error('Connection lost: ' + responseObject.errorMessage);
    }
  }

  onMessageArrived(message) {
    const value = parseFloat(message.payloadString);
    switch (message.destinationName) {
      case 'rahmad/ph':
        if (this.onPhUpdate) this.onPhUpdate(value);
        break;
      case 'rahmad/temp':
        if (this.onTempUpdate) this.onTempUpdate(value);
        break;
      case 'rahmad/hum':
        if (this.onHumUpdate) this.onHumUpdate(value);
        break;
      case 'rahmad/nut':
        if (this.onNutUpdate) this.onNutUpdate(value);
        break;
      default:
        console.log('Unhandled message topic: ', message.destinationName);
    }
  }

  sendControl(topic, state) {
    const message = new Paho.Message(state ? 'ON' : 'OFF');
    message.destinationName = topic;
    this.client.send(message);
  }
}

const mqttClient = new MqttClient();
export default mqttClient;
