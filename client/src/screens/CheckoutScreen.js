// CheckoutScreen.js
import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, View, Text, Button, StyleSheet } from "react-native";
import DbUtils from '../helpers/dbUtils';

export default function CheckoutScreen({ navigation }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
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
        const response = await fetch(`${apiUrl}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pending_items: cartItems.map(item => {  
                    return ({
                        id: item.id,
                        amount: item.quantity,
                    });
                }),
                customer_id: userId,
            }),
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Barcode Scanner GmbH",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (!error) {
            setLoading(true);
        } else {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();
    
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

    const handleCheckout = async () => {
        await openPaymentSheet();
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
        <View style={styles.container}>
            <Text style={styles.title}>Checkout Summary</Text>
            {cartItems.map(item => (
                <View key={item.id} style={styles.item}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                    <Text style={styles.itemPrice}>{item.price}€</Text>
                </View>
            ))}
            <Text style={styles.totalPrice}>Total Price: {totalPrice}€</Text>
            <Button title="Confirm Order" disabled={!loading} onPress={handleCheckout} />
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    item: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
    },
    itemName: {
        fontSize: 18,
    },
    itemQuantity: {
        fontSize: 16,
    },
    itemPrice: {
        fontSize: 16,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
});
