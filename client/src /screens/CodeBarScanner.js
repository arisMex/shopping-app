import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';


export default function ScanScreen({ route }) {

  const { exam } = route.params;
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [listIn, setListIn] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const id = getLastPartOfUrl(data);
    if (listIn.indexOf(id) === -1) {
      const updatedList = [...listIn, id]; // Nouvelle liste avec l'ID ajouté
      setListIn(updatedList); // Mettre à jour l'état listIn
  
      retrievedArray = await getSessionData(exam.id.toString());
      if (retrievedArray == null) { // si elle n'existe pas dans le local storage
        saveSessionData(exam.id.toString(), [], [])
      }
      await updateSessionStudentsList1(exam.id.toString(), updatedList); // Utiliser la nouvelle liste mise à jour

      // TEST
      let dat = await getSessionStudentsList1(exam.id.toString());
      console.log('Tableau local :', updatedList); // Afficher la nouvelle liste
      console.log('Tableau récupéré  :', dat);
    } else {
      alert(`id étudiant déjà scanné !`);
      console.log(`id étudiant déjà scanné !`);
    }
  };
  
  

  function getLastPartOfUrl(url) {  // récupérer la derniere partie de l'url du QR code de la Léo catre
    const parts = url.split('-');
    return parts[parts.length - 2];
  }




  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {scanned && (
        <Button
          title="Tap to add item"
          onPress={() => setScanned(false)}
        />
      )}


    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});