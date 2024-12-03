import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Text, View, StyleSheet, Button, StatusBar, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';
import { ThemeContext } from '../contexts/ThemeContext';

import DbUtils from '../helpers/dbUtils';

export default function HomeScreen({ navigation }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [count, setCount] = useState('');
    const [dbUtils, setDbUtils] = useState(null);

    const openDatabase = async () => {
        const utils = new DbUtils();
        await utils.init();
        setDbUtils(utils);

        const cartItems = await utils.getCartItems();
        calculateAndSetTotalPrice(cartItems);
        setCount(cartItems.length);
    };

    const calculateAndSetTotalPrice = (cartItems) => {
        const total = cartItems.reduce((accumulatedTotal, item) => {
            return accumulatedTotal + (item.price * item.quantity);
        }, 0);

        setTotalPrice(total);
    };

    // Utilisation de useFocusEffect pour que le code s'exécute à chaque fois que l'écran devient actif
    useFocusEffect(
        useCallback(() => {
            openDatabase();
        }, [])
    );

    return (
        <View style={[styles.container, theme.container]}>
            <StatusBar
                animated={true}
                backgroundColor={theme.topBarColor}
                barStyle={'light-content'} //TODO: Set this to 'dark-content' for light background
                translucent={true}
                hidden={Platform.OS === "ios"}
            />

            <TopBar />

            <TabBar navigation={navigation} />

            <ScrollView style={styles.myScrollView}>
                <View style={styles.welcomeContainer}>
                    <Text style={[styles.welcomeText, { color: theme.itemTitelColor }, styles.header]}>
                        Bienvenue dans votre magasin !
                    </Text>
                    <Text style={styles.subText}>
                        Accédez facilement à vos articles et gérez votre panier.
                    </Text>
                </View>

                <View style={[styles.cartSummaryContainer, theme.itemCard]}>
                    <Text style={[styles.totalPriceText, theme.redText]}>
                        Total du Panier : {totalPrice} €
                    </Text>
                    <Text style={[styles.cartItemsText, theme.greenText]}>
                        N° d'articles dans le panier : {count} article(s)
                    </Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Scan')}
                    >
                        <MaterialIcons name="barcode-reader" size={20} color="white" style={styles.icon} />
                        <Text style={styles.buttonText}>Reprendre vos achats</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('CartScreen')}
                    >
                        <MaterialIcons name="shopping-cart" size={20} color="white" style={styles.icon} />
                        <Text style={styles.buttonText}>Voir votre Panier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('History')}
                    >
                        <MaterialIcons name="history" size={20} color="white" style={styles.icon} />
                        <Text style={styles.buttonText}>Voir l'historique des achats</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleTheme}
                    >
                        <MaterialIcons name="brightness-6" size={20} color="white" style={styles.icon} />
                        <Text style={styles.buttonText}>Changer Thème</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    myScrollView: {
        maxHeight: "80%",
    },
    container: {
        flex: 1,
        width: '100%',
        marginTop: Platform.OS !== 'ios' ? 20 : 0,
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
    },
    welcomeContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    subText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 10,
    },
    cartSummaryContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'white',
        paddingLeft: 20
    },
    totalPriceText: {
        color: '#FF3131',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cartItemsText: {
        color: 'green',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },


});

