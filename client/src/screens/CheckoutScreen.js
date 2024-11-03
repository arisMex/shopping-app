import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import DbUtils from '../helpers/dbUtils';
import TopBar from '../components/TopBar'; 
import TabBar from '../components/TabNavigation'; 
import { ThemeContext } from '../contexts/ThemeContext';

export default function CheckoutScreen({ navigation }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { theme } = useContext(ThemeContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dbUtils, setDbUtils] = useState(null);

    const apiUrl = Constants.expoConfig.extra.apiUrl;
    const userId = Constants.expoConfig.extra.USER_Id;

    const openDatabase = async () => {
        const utils = new DbUtils();
        await utils.init();
        setDbUtils(utils);
        
        const items = await utils.getCartItems();
        setCartItems(items);
        
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(`${apiUrl}/payments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pending_items: cartItems.map(item => ({
                        id: item.item_id,
                        amount: item.quantity,
                    })),
                    customer_id: userId,
                }),
            });

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

            const { paymentIntent, ephemeralKey, customer } = await response.json();
            return { paymentIntent, ephemeralKey, customer };
        } catch (error) {
            console.error("Error fetching payment sheet params:", error);
            Alert.alert("Error", "Failed to initialize payment. Please try again later.");
            return {};
        }
    };

    const initializePaymentSheet = async () => {
        const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

        if (!paymentIntent || !ephemeralKey || !customer) return;

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Barcode Scanner GmbH",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (error) {
            Alert.alert(`Error: ${error.message}`);
        } else {            
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();
            console.log(error);
            
            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                Alert.alert('Success', 'Your order is confirmed!');
                navigation.goBack();
            }
        } catch (err) {
            console.error('Unexpected error during payment sheet presentation:', err);
            Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
        }
    };

    useEffect(() => {
        openDatabase();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            initializePaymentSheet();
        }
    }, [cartItems]);

    return (
        <View style={[styles.container, theme.container]}>
            <StatusBar
                animated={true}
                backgroundColor={"red"}
                barStyle={'light-content'} // TODO: Set this to 'dark-content' for light background
                translucent={true}
                hidden={Platform.OS === "ios"}
            />
            <TopBar />
            <TabBar navigation={navigation} />
            <ScrollView style={styles.myScrollView}>
                <Text style={styles.title}>Résumé de la commande</Text>
                {cartItems.map((item, index) => (
                    <View key={item.item_id} style={[styles.itemContainer, theme.itemCard]}>
                        <Text style={theme.text}>{index + 1}. {item.name}</Text>
                        <Text style={theme.greenText}>{item.price}€</Text>
                        <Text style={theme.text}>x {item.quantity}</Text>
                    </View>
                ))}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalPrice}>Total Price: {totalPrice}€</Text>
                </View>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        disabled={!loading}
                        onPress={openPaymentSheet}
                    >
                        <MaterialIcons name="payment" size={20} color="white" />
                        <Text style={styles.buttonText}>Confirm Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                        <Text style={styles.buttonText}>Go Back</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "red",
        marginVertical: 20,
        paddingHorizontal: 16,
    },
    itemContainer: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalContainer: {
        marginVertical: 20,
        paddingHorizontal: 16,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF3131',
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
});
