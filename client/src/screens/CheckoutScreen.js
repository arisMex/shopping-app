import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
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
    const [paymentIntentId, setPaymentIntentId] = useState("");


    const { theme } = useContext(ThemeContext);

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dbUtils, setDbUtils] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiUrl = Constants.expoConfig.extra.apiUrl;
    const userId = Constants.expoConfig.extra.userId;
    const publishableKey = Constants.expoConfig.extra.stripePK;

    // Initialisation de la base de données et récupération des items du panier
    const openDatabase = async () => {
        try {
            const utils = new DbUtils();
            setDbUtils(utils);
            await utils.init();

            const items = await utils.getCartItems();
            setCartItems(items);

            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice(total);
        } catch (error) {
            console.error("Database error:", error);
            Alert.alert("Error", "Failed to load cart items.");
        }
    };

    // Récupération des paramètres nécessaires pour Stripe
    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(`${apiUrl}/payments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${publishableKey}`,
                },
                body: JSON.stringify({
                    pending_items: cartItems.map(item => ({
                        id: item.item_id,
                        amount: item.quantity * 100,
                    })),
                    customer_id: userId,
                }),
            });

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

            return await response.json();
        } catch (error) {
            console.error("Error fetching payment sheet params:", error);
            Alert.alert("Error", "Failed to initialize payment. Please try again later.");
            return {};
        }
    };

    // Initialisation de la feuille de paiement Stripe
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
            Alert.alert("Error", error.message);
        } else {
            setLoading(true);
            setPaymentIntentId(paymentIntent)
        }
    };

    // Ouverture de la feuille de paiement Stripe
    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();

            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
                const response = await fetch(`${apiUrl}/payments/check/${paymentIntent}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "customer_id": userId
                    })
                });

                if (response.status == 200) Alert.alert('Success', 'Your order is confirmed!');
                await dbUtils.emptyCart();
                Alert.alert("Success", "Your order is confirmed!");
                navigation.goBack();
            }
        } catch (err) {
            console.error("Unexpected error during payment:", err);
            Alert.alert("Error", "An unexpected error occurred. Please try again later.");
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
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier="merchant.identifier" // requis pour Apple Pay
            urlScheme="your-url-scheme" // requis pour 3D Secure et redirections bancaires
        >
            <View style={[styles.container, theme.container]}>
                <StatusBar
                    animated={true}
                    backgroundColor={"red"}
                    barStyle="light-content"
                    translucent={true}
                    hidden={Platform.OS === "ios"}
                />
                <TopBar />
                <TabBar navigation={navigation} />
                <ScrollView style={styles.myScrollView}>
                    <Text style={styles.title}>Résumé de la commande</Text>
                    {cartItems.map((item, index) => (
                        <View key={item.id} style={[styles.itemContainer, theme.itemCard]}>
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
        </StripeProvider>
    );
}

const styles = StyleSheet.create({
    myScrollView: {
        maxHeight: "80%",
    },
    container: {
        flex: 1,
        width: "100%",
        marginTop: Platform.OS !== "ios" ? 20 : 0,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "red",
        marginVertical: 20,
        paddingHorizontal: 16,
    },
    itemContainer: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalContainer: {
        marginVertical: 20,
        paddingHorizontal: 16,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF3131",
    },
    actionsContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: "80%",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        marginLeft: 5,
    },
});
