import React, { useState, useEffect, useContext} from 'react';
import { Text, View, StyleSheet, StatusBar, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';

import DbUtils from '../helpers/dbUtils';
import DbFetchers from '../helpers/dbFetchers';

import { ThemeContext } from '../contexts/ThemeContext';


export default function History({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);


  const [dbUtils, setDbUtils] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedItems, setExpandedItems] = useState({}); // Track expanded state per payment ID

  const openDatabase = async () => {
    const utils = new DbUtils();
    await utils.init();
    setDbUtils(utils);

    const fetchers = new DbFetchers(); 
    const history_ = await fetchers.fetch_payments_by_customer_id();
    setHistory(history_);
  };

  useEffect(() => {
    openDatabase();
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={[styles.container, theme.container]}>
      <StatusBar
        animated={true}
        backgroundColor={"red"}
        barStyle={'light-content'} //TODO: Set this to 'dark-content' for light background
        translucent={true}
        hidden={Platform.OS === "ios"}
      />

      <TopBar />

      <TabBar navigation={navigation} />

      <ScrollView style={styles.myScrollView}>
        <Text style={styles.header}>Historique :</Text>
        {
          history.map((payment) => (
            payment.is_checked &&
            <View key={payment.id} style={[styles.paymentContainer, theme.itemCard]} >
              <View style={styles.state}>
                <MaterialIcons
                  name={"payment"}
                  size={15}
                  color="red"
                  style={styles.toggleIcon} // Add style to adjust icon position
                />
                <Text style={theme.text}>  Etat: {payment.is_checked ? "Validé" : "Non validé"} </Text>
              </View>

              {
                payment.is_checked && (
                  <View style={styles.state}>
                    <MaterialIcons
                      name={"calendar-today"}
                      size={15}
                      color="red"
                      style={styles.toggleIcon}
                    />
                    <Text style={theme.text}>  Date: {payment.checkout_date ? payment.checkout_date.split("T")[0] : "N/A"}</Text>
                  </View>
                )
              }

              {/* Toggle Button */}
              < View >
                <TouchableOpacity onPress={() => toggleExpand(payment.id)} style={styles.toggleButton} >
                  <MaterialIcons
                    name={expandedItems[payment.id] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={30}
                    color="red"
                    style={styles.toggleIcon} // Add style to adjust icon position
                  />
                </TouchableOpacity>
              </View>

              {/* Collapsible Purchased Items */}
              {

                expandedItems[payment.id] && (
                  <View style={styles.itemsContainer}>
                    {
                      payment.purchased_items.map((item, index) => (
                        <View key={index} style={styles.itemContainer} >
                          <Text style={theme.text}>{index + 1}.     {item.item.name} </Text>
                          < Text style={theme.greenText} > {item.item.price}€</Text>
                          < Text  style={theme.text}> x {item.amount} </Text>
                        </View>
                      ))
                    }
                  </View>
                )
              }
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  myScrollView:{
    maxHeight: "80%"
  },
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "red",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  paymentContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    margin: 16
  },
  toggleButton: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemsContainer: {
    paddingTop: 10,
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: "row",
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: "90%",
  },
  state: {
    flexDirection: "row",
  }


});
