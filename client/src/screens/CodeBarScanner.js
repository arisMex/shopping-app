import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, FlatList, Alert, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';
import { MaterialIcons } from '@expo/vector-icons';

import DbUtils from '../helpers/dbUtils';

export default function CodeBarScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [panier, setPanier] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [number, onChangeNumber] = useState('');



  const isDisabled = number === '';

  const [dbUtils, setDbUtils] = useState(null);

  const openDatabase = async () => {
    const utils = new DbUtils();
    await utils.init();
    setDbUtils(utils);
    const cartItems = await utils.getCartItems(); 
    setPanier(cartItems); 
  };

  const addItemToCart = async (itemDetails) => {
    try {
      await dbUtils.addItem(itemDetails.name, itemDetails.price, "445555");
      const cartItems = await dbUtils.getCartItems();
      console.log("ldldld", cartItems);
      
      setPanier(cartItems)
    } catch (error) {
      console.error("Error adding item to cart", error);
    }
  };

  useEffect(() => {
    openDatabase();
  }, []);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };


  const handleBarCodeScanned = async ({ type, item_barcode }) => {
    setScanned(true);

    //TODO :  ajouter peut etre un petit son : tiiiin !

    try {
      // Récupérer les détails de l'élément à partir de la base de données

      //TODO await dbUtils.fetchItemDetails()
      itemDetails = await dbUtils.fetchItemDetails(2)

      if (itemDetails) {
        setPanier(prevPanier => {
          const existingItemIndex = prevPanier.findIndex(item => item.id === itemDetails.id);

          if (existingItemIndex !== -1) {
            // Si l'élément existe, on incrémente la quantité
            const updatedPanier = [...prevPanier];
            updatedPanier[existingItemIndex].quantity += 1;
            addItemToCart(itemDetails)
            return updatedPanier;
          } else {
            addItemToCart(itemDetails)
            return [...prevPanier, { ...itemDetails, quantity: 1 }];
          }
        });

        // Mettre à jour le prix total
        setTotalPrice(totalPrice + itemDetails.price);
      } else {
        console.log('Élément non trouvé pour le code-barres:', item_barcode);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'élément:', error);
    }

    // Attendre un peu avant de réinitialiser le scanner
    await sleep(1500);
    setScanned(false);
  };


  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onAdd = async ({ type, item_barcode }) => {
    try {
      // Récupérer les détails de l'élément à partir de la base de données

      //TODO await dbUtils.fetchItemDetails()
      itemDetails = await dbUtils.fetchItemDetails(1)

      if (itemDetails) {
        setPanier(prevPanier => {
          const existingItemIndex = prevPanier.findIndex(item => item.id === itemDetails.id);

          if (existingItemIndex !== -1) {
            // Si l'élément existe, on incrémente la quantité
            const updatedPanier = [...prevPanier];
            updatedPanier[existingItemIndex].quantity += 1;
            return updatedPanier;
          } else {
            return [...prevPanier, { ...itemDetails, quantity: 1 }];
          }
        });

        // Mettre à jour le prix total
        setTotalPrice(totalPrice + itemDetails.price);
      } else {
        console.log('Élément non trouvé pour le code-barres:', item_barcode);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'élément:', error);
    }
    onChangeNumber('')
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={"red"}
        barStyle={'light-content'} //TODO dark/light
        translucent={true}
        hidden={false}
      />

      <TopBar />

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[styles.camera, { opacity: scanned ? 0.5 : 1 }]}
      />

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="Saisir le code bar ..."
          placeholderTextColor={"gray"}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.button, isDisabled && styles.disabledButton]}
          onPress={isDisabled ? null : onAdd}
          disabled={isDisabled}
        >
          <MaterialIcons name="add" size={20} color={isDisabled ? 'gray' : 'white'} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>
          Total Price: {totalPrice.toFixed(2)} €
        </Text>
        <Text style={styles.totalPriceText}>
          {panier.length} {panier.length != 1 ? "items" : "item"}
        </Text>
      </View>

      <FlatList
        data={panier}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemIndex}>
              {index + 1}.
            </Text>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                {item.price} € x {item.quantity} = {(item.price * item.quantity).toFixed(2)} €
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
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
  },

  disabledButton: {
    backgroundColor: '#ccc',
  },

  panierList: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemIndex: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: 'green',
  },

  totalPriceContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  totalPriceText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
