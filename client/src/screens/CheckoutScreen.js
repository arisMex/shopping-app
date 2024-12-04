import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import DbUtils from '../helpers/dbUtils';
import TopBar from '../components/TopBar';
import TabBar from '../components/TabNavigation';
import { ThemeContext } from '../contexts/ThemeContext';
import { checkPayment, fetchPaymentSheetParams } from "../services/paymentService";

export default function CheckoutScreen({ navigation }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [paymentIntentId, setPaymentIntentId] = useState("");


    const { theme } = useContext(ThemeContext);

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dbUtils, setDbUtils] = useState(null);
    const [loading, setLoading] = useState(false);

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


    // Initialisation de la feuille de paiement Stripe
    const initializePaymentSheet = async () => {
        const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams(cartItems);

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
                const response = checkPayment(paymentIntentId);
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
