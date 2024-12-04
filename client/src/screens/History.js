import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Text, View, StyleSheet, StatusBar, Platform, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import du hook
import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';
import DbUtils from '../helpers/dbUtils';
import { PaymentItem } from '../components/History/PaymentItem';
import { EmptyHistory } from '../components/History/EmptyHistory';
import { ThemeContext } from '../contexts/ThemeContext';
import { fetchPaymentsByCustomerId } from '../services/paymentService';


export default function History({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);


  const [dbUtils, setDbUtils] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedItems, setExpandedItems] = useState({}); // Track expanded state per payment ID

  const openDatabase = async () => {
    const utils = new DbUtils();
    await utils.init();
    setDbUtils(utils);

    const history_ = await fetchPaymentsByCustomerId();
    setHistory(history_);
  };

  useFocusEffect(
    useCallback(() => {
      openDatabase(); // Appeler la fonction openDatabase
    }, [])
  );

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
        backgroundColor={theme.topBarColor}
        barStyle={'light-content'}
        translucent={true}
        hidden={Platform.OS === "ios"}
      />
      <TopBar />
      <TabBar navigation={navigation} />
      <ScrollView style={styles.myScrollView}>
        <Text style={styles.header}>Historique :</Text>
        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          history.map((payment) => (
            payment.is_checked &&
            <PaymentItem
              key={payment.id}
              payment={payment}
              expanded={expandedItems[payment.id]}
              toggleExpand={toggleExpand}
              theme={theme}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: Platform.OS !== 'ios' ? 20 : 0,
  },
  myScrollView: {
    maxHeight: "80%",
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "red",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
});
