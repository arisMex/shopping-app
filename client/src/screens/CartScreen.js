import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, StatusBar, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DbUtils from '../helpers/dbUtils';
import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';

import { ThemeContext } from '../contexts/ThemeContext';



export default CartScreen = ({ navigation }) => {

    const { theme, toggleTheme } = useContext(ThemeContext);

    const [cartItems, setCartItems] = useState([]);
    const [dbUtils, setDbUtils] = useState(null);

    const openDatabase = async () => {
        const utils = new DbUtils();
        await utils.init();
        setDbUtils(utils);

        const items = await utils.getCartItems();
        setCartItems(items);
    };

    useEffect(() => {
        openDatabase();
    }, []);//cartItems

    const increaseQuantity = async (id) => {
        if (dbUtils) {
            await dbUtils.increaseQuantity(id);
            const updatedItems = await dbUtils.getCartItems();
            setCartItems(updatedItems);
        }
    };

    const decreaseQuantity = async (id, quantity) => {
        if (dbUtils) {
            await dbUtils.decreaseQuantity(id, quantity);
            const updatedItems = await dbUtils.getCartItems();
            setCartItems(updatedItems);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Text style={[styles.itemName, theme.text]}>{item.name}</Text>
            </View>
            <View style={styles.itemPriceContainer}>
                <Text style={[styles.itemPrice, theme.text]}>{item.price}€</Text>
            </View>
            <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => decreaseQuantity(item.id, item.quantity)}>
                    <Text style={[styles.quantityButton, theme.redText]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.quantity, theme.text]}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <Text style={[styles.quantityButton, theme.greenText]}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    


    return (

        <View style={[styles.container, theme.container]}>
            <StatusBar
                animated={true}
                backgroundColor={"red"}
                barStyle={'light-content'}
                translucent={true}
                hidden={Platform.OS === "ios"}
            />

            <TopBar />

            <View style={styles.content}>
                <Text style={styles.header}>Mon Panier :</Text>

                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
                <TouchableOpacity
                    style={[styles.button, theme.goCheckoutButton]}
                    onPress={() => navigation.navigate('CheckoutScreen')}
                >
                    <MaterialIcons name="shopping-cart" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Passer au paiement</Text>
                    <MaterialIcons name="arrow-forward" size={24} color="#fff" style={styles.icon} />
                </TouchableOpacity>
            </View>

            <TabBar
                navigation={navigation}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 100
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: "red"
    },
    itemInfo: {
        flex: 3,  // Allow more space for the item name
    },
    itemName: {
        fontSize: 18,
        flexWrap: 'wrap',
        fontWeight: "bold"
    },
    itemPriceContainer: {
        flex: 1,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "600"
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,  
        justifyContent: 'space-between',
    },
    quantity: {
        fontSize: 18,
        width: 30,  
        textAlign: 'center',
    },
    quantityButton: {
        fontSize: 24,
        padding: 5,
        marginHorizontal: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        marginBottom : 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    icon: {
        marginHorizontal: 5,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "red",
        marginVertical: 20,
        paddingHorizontal: 16,
    },

});
