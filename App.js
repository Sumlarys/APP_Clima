import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, Image } from 'react-native';

// Mapeo de las provincias de Andalucía con sus códigos correspondientes
const codigoProvincia = {
  Almería: '04',
  Cádiz: '11',
  Córdoba: '14',
  Granada: '18',
  Huelva: '21',
  Jaén: '23',
  Málaga: '29',
  Sevilla: '41',
};

// Mapeo de descripciones de clima con rutas de imágenes representativas
const iconosClima = {
  soleado: require('./icons/sunny.jpg'),
  nublado: require('./icons/cloudy.png'),
  lluvioso: require('./icons/rainy.jpg'),
  tormenta: require('./icons/storm.png'),
  default: require('./icons/default.png'),
};

// Componente principal de la aplicación de clima
const ClimaApp = () => {
  const [provincia, setProvincia] = useState(''); // Estado para almacenar el nombre de la provincia
  const [tiempo, setTiempo] = useState(null);     // Estado para almacenar los datos del clima
  const [loading, setLoading] = useState(false);  // Estado para mostrar el indicador de carga

   // Ejecutar este efecto solo cuando `tiempo` cambie
   useEffect(() => {
    if (tiempo) {
      console.log(tiempo);
    }
  }, [tiempo]);

  // Función que obtiene los datos del clima de la API
  const fetchClima = async () => {
    const codigo = codigoProvincia[provincia.trim()]; // Obtiene el código de la provincia ingresada
    if (!codigo) {
      Alert.alert('Error', 'Por favor, ingresa una provincia andaluza válida');
      return;
    }

    setLoading(true); // Activa el estado de carga

    try {
      // Llamada a la API con axios usando el código de la provincia
      const response = await axios.get(`https://www.el-tiempo.net/api/json/v2/provincias/${codigo}`);
      const data = response.data; // Obtiene los datos de la respuesta
      // Verifica que los datos de clima existan
      if (data != null) {
        const nuevoTiempo = {
          tempMax: data.ciudades[0].temperatures.max,
          tempMin: data.ciudades[0].temperatures.min,
          description: data.ciudades[0].stateSky.description.toLowerCase(),
          title: data.title,
          today: data.today.p,
        };
        console.log("Nuevo tiempo:", nuevoTiempo); // Aseguramos de que estamos recibiendo los datos
        setTiempo(nuevoTiempo);
      } else {
        Alert.alert('Información', 'No se encontraron datos de clima para esta provincia.');
        setTiempo(null);
      }

    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al obtener el clima. Inténtelo de nuevo');
      setTiempo(null);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Clima en Andalucía</Text>

      {/* Campo de texto para ingresar el nombre de la provincia */}
      <TextInput 
        style={styles.input}
        placeholder='Ingresa una provincia (Ej: Sevilla)'
        value={provincia}
        onChangeText={setProvincia}
      />

      {/* Botón para buscar el clima */}
      <Button title='Buscar Clima' onPress={fetchClima} />

      {/* Muestra el texto de carga mientras se obtienen los datos */}
      {loading && <Text>Cargando...</Text>}

      {/* Muestra los datos del clima si están disponibles */}
      {(tiempo != null) && (
        <View style={styles.weatherContainer}>
          <Text style={styles.header}>{tiempo.title}</Text>
          <Text style={styles.temperature}>{tiempo.tempMax}ºC de máxima</Text>
          <Text style={styles.temperature}>{tiempo.tempMin}ºC de mínima</Text>
          <View style={styles.description}>
            <Text style={styles.description}>{tiempo.description}</Text>
            {/* Muestra el icono basado en la descripción del clima, o un icono genérico */}
            <Image 
              source={iconosClima[tiempo.description] || iconosClima.default}
              style={styles.icon}
            />
          </View>
          <Text style={styles.description}>{tiempo.today}</Text>
        </View>
      )}
    </View>
  );
}

// Estilos para la interfaz de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  weatherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  temperature: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    flexDirection: 'row',
    color: 'blue',
  },
  description:{
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon:{
    width: 100,
    height: 100,
    marginLeft: 20,
  }
});

export default ClimaApp;
