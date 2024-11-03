import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Button, TextInput, FlatList, Alert, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';
import { MaterialIcons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';


import DbUtils from '../helpers/dbUtils';
import DbFetchers from '../helpers/dbFetchers';
//import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export default function CodeBarScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [panier, setPanier] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [number, onChangeNumber] = useState('');
  const [opacityColor, setOpacityColor] = useState('green');

  const [error, setError] = useState({
    error: false,
    text: ""
  });

  const { theme, toggleTheme } = useContext(ThemeContext);

  const isDisabled = number === '';

  const [dbUtils, setDbUtils] = useState(null);
  const [dbFetchers, setDbFetchers] = useState(null);

  const openDatabase = async () => {
    const utils = new DbUtils();
    await utils.init();
    setDbUtils(utils);

    const dbFetchersUtils = new DbFetchers();
    setDbFetchers(dbFetchersUtils)

    const cartItems = await utils.getCartItems();
    setPanier(cartItems);
    calculateAndSetTotalPrice(cartItems)
  };

  const calculateAndSetTotalPrice = (cartItems) => {
    const total = cartItems.reduce((accumulatedTotal, item) => {
      return accumulatedTotal + (item.price * item.quantity);
    }, 0);

    setTotalPrice(total);
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


  const handleBarCodeScanned = async ({ type, data }) => {
    const item_barcode = data; // Use 'const' for item_barcode
    console.log(data);

    setScanned(true);

    // Optional: add sound here if needed

    // Fetch item details from the server
    const itemDetails = await dbFetchers.fetchItemDetails(item_barcode);

    if (itemDetails) {
      // Process item details if found
      setPanier(prevPanier => {
        const existingItemIndex = prevPanier.findIndex(item => item.barcode === itemDetails.barcode);
        if (existingItemIndex !== -1) {
          // If item exists, increment the quantity
          const updatedPanier = [...prevPanier];
          updatedPanier[existingItemIndex].quantity += 1;
          addItemToCart(itemDetails);
          return updatedPanier;
        } else {
          addItemToCart(itemDetails);
          return [...prevPanier, { ...itemDetails, quantity: 1 }];
        }
      });

      // Update total price
      setTotalPrice(totalPrice + itemDetails.price);
    } else {
      // Handle error case when item is not found
      setError({
        error: true,
        text: `Élément non enregistré : ${item_barcode}`
      });
      console.log('Élément non trouvé pour le code-barres:', item_barcode);
    }

    await sleep(1500);
    setScanned(false);
    setError({ error: false, text: "" });
    setOpacityColor("green");
  };


  // Fonction pour ajouter l'élément au panier
  const addItemToCart = async (itemDetails) => {
    try {

      console.log(itemDetails.id, itemDetails.name,);
      
      await dbUtils.addItem(itemDetails.id, itemDetails.name, itemDetails.price, itemDetails.barcode);


      const cartItems = await dbUtils.getCartItems();
      // Mettre à jour le panier dans l'état
      setPanier(cartItems);
    } catch (error) {
      console.error("Error adding item to cart", error);
    }
  };



  const removeItemFromCart = async (barcode) => {
    try {
      await dbUtils.removeItem(barcode);
      const cartItems = await dbUtils.getCartItems();
      setPanier(cartItems);
      calculateAndSetTotalPrice(cartItems)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article du panier:", error);
    }
  };



  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onManualAdd = async (item_barcode) => {
    try {
      // Récupérer les détails de l'élément à partir de la base de données

      itemDetails = await dbFetchers.fetchItemDetails(item_barcode)

      if (itemDetails) {
        setPanier(prevPanier => {
          const existingItemIndex = prevPanier.findIndex(item => item.barcode === itemDetails.barcode);

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
    onChangeNumber('')
  };

  return (
    <View style={[styles.container, theme.container]}>
      <StatusBar
        animated={true}
        backgroundColor={"red"}
        barStyle={'light-content'} //TODO dark/light
        translucent={true}
        hidden={Platform.OS === "ios"}
      />

      <TopBar />

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[
          styles.camera,
          {
            opacity: scanned ? 0.5 : 1,
            backgroundColor: scanned ? 'green' : 'transparent' //opacityColor
          }
        ]}
      />
      {error.error && (
        <View style={styles.scanError}>
          <MaterialIcons
            name="warning"
            size={20}
            color={isDisabled ? 'gray' : 'red'} 
            style={styles.icon}
          />
          <Text style={styles.errorText}>
            {error.text}
          </Text>
        </View>
      )}





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
          onPress={isDisabled ? null : () => onManualAdd(number)}
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
            <Text style={[styles.itemIndex, {color: theme.itemTitelColor}]}>
              {index + 1}.
            </Text>
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, {color: theme.itemTitelColor}]}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                {item.price} € x {item.quantity} = {(item.price * item.quantity).toFixed(2)} €
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.buttonDelete]}
              onPress={() => removeItemFromCart(item.barcode)}
            >
              <MaterialIcons name="delete" size={25} color={'red'} />
            </TouchableOpacity>
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
    //backgroundColor: 'white',
    width: '100%',
    marginTop: Platform.OS !== 'ios' ? 20 : 0,
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
    width: '85%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 10,
    overflow: 'hidden',
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
  buttonDelete: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scanError: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
