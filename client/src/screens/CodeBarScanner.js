import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, FlatList, Alert, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';
import { MaterialIcons } from '@expo/vector-icons'; 
//import { ScrollView } from 'react-native-gesture-handler';

export default function CodeBarScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [panier, setPanier] = useState([]);
  const [number, onChangeNumber] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };


  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    setPanier(prevPanier => [...prevPanier, data]); // Ajouter l'élément scanné au panier

    await sleep(2000);
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const onAdd = () => {
    setPanier(prevPanier => [...prevPanier, number]);
    onChangeNumber('')
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={"red"}
        barStyle={'light-content'}
        translucent={Platform.OS === 'android'}
      />

      <TopBar />

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
      />
      {scanned && <Button title="Scan Again" onPress={() => setScanned(false)} />}

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="Saisir le code bar ..."
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={onAdd}>
          <MaterialIcons name="add" size={20} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={panier}
        renderItem={({ item, index }) => (
          <Text style={styles.item}>{index + 1}.   {item} item name</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.panierList}
      />

      <TabBar
        navigation={navigation}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  item: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  camera: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 10,
    overflow: 'hidden'
  },
  panierList: {
    marginVertical: 50,
    marginBottom: 200,
    width: '90%',
    alignSelf: 'center',
    height: "50%", 
    backgroundColor: 'white',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    color: "black"
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red', 
    padding: 10,
    borderRadius: 5,
    height: 40
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5, 
  },
  icon: {
    marginRight: 5, 
  },

  inputView: {
    width: "100%",
    flexDirection: "row",
    alignItems: 'center',
    alignContent: "center",
    justifyContent: "center"
  }
});
