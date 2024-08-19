import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import mqttClient from './src/mqttClient';

const App = () => {
  const [phValue, setPhValue] = useState(null);
  const [tempValue, setTempValue] = useState(null);
  const [humValue, setHumValue] = useState(null);
  const [nutValue, setNutValue] = useState(null);

  const [lampState, setLampState] = useState(false);
  const [sprayState, setSprayState] = useState(false);
  const [fan1State, setFan1State] = useState(false);
  const [fan2State, setFan2State] = useState(false);

  useEffect(() => {
    const handlePhUpdate = (value) => setPhValue(value);
    const handleTempUpdate = (value) => setTempValue(value);
    const handleHumUpdate = (value) => setHumValue(value);
    const handleNutUpdate = (value) => setNutValue(value);

    mqttClient.onPhUpdate = handlePhUpdate;
    mqttClient.onTempUpdate = handleTempUpdate;
    mqttClient.onHumUpdate = handleHumUpdate;
    mqttClient.onNutUpdate = handleNutUpdate;

    mqttClient.connect();

    return () => {
      mqttClient.client.disconnect();
    };
  }, []);

  const toggleLamp = () => {
    const newState = !lampState;
    setLampState(newState);
    mqttClient.sendControl('rahmad/lamp', newState);
  };

  const toggleSpray = () => {
    const newState = !sprayState;
    setSprayState(newState);
    mqttClient.sendControl('rahmad/spray', newState);
  };

  const toggleFan1 = () => {
    const newState = !fan1State;
    setFan1State(newState);
    mqttClient.sendControl('rahmad/fan1', newState);
  };

  const toggleFan2 = () => {
    const newState = !fan2State;
    setFan2State(newState);
    mqttClient.sendControl('rahmad/fan2', newState);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>GreenApp Monitoring</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Temperature</Text>
          <Text style={styles.cardValue}>
            {tempValue !== null ? `${tempValue}` : 'Loading...'}
            <Text style={styles.cardUnit}> °C</Text>
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Humidity</Text>
          <Text style={styles.cardValue}>
            {humValue !== null ? `${humValue}` : 'Loading...'}
            <Text style={styles.cardUnit}> %</Text>
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>pH Level</Text>
          <Text style={styles.cardValue}>
            {phValue !== null ? `${phValue}` : 'Loading...'}
            <Text style={styles.cardUnit}> pH</Text>
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nutrients</Text>
          <Text style={styles.cardValue}>
            {nutValue !== null ? `${nutValue}` : 'Loading...'}
            <Text style={styles.cardUnit}> ppm</Text>
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.controlButton, lampState ? styles.buttonOn : styles.buttonOff]}
          onPress={toggleLamp}
        >
          <Text style={styles.buttonText}>{lampState ? 'Lamp Off' : 'Lamp On'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, sprayState ? styles.buttonOn : styles.buttonOff]}
          onPress={toggleSpray}
        >
          <Text style={styles.buttonText}>{sprayState ? 'Sprayer Off' : 'Sprayer On'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, fan1State ? styles.buttonOn : styles.buttonOff]}
          onPress={toggleFan1}
        >
          <Text style={styles.buttonText}>{fan1State ? 'Fan 1 Off' : 'Fan 1 On'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, fan2State ? styles.buttonOn : styles.buttonOff]}
          onPress={toggleFan2}
        >
          <Text style={styles.buttonText}>{fan2State ? 'Fan 2 Off' : 'Fan 2 On'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e5e5e5',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#5865F2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlButton: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 6,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonOn: {
    backgroundColor: '#4caf50',
  },
  buttonOff: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default App;
