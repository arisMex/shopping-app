import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, StatusBar, Platform, StyleSheet, View } from "react-native";
import TabBar from '../components/TabNavigation';
import TopBar from '../components/TopBar';




export default function Checkout({ navigation }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState("");

    const apiUrl = Constants.expoConfig?.extra?.apiUrl;
    const stripePK = Constants.expoConfig?.extra?.stripePK;

    const userId = "cus_R0Lu680x5Dky69";
    const items = [
        {
            "id": 1,
            "amount": 2
        }
    ];

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`${apiUrl}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "pending_items": items,
                "customer_id": userId
            })
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
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (!error) {
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
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
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <View style={styles.container}>

            <StatusBar
                animated={true}
                backgroundColor={"red"}
                barStyle={'light-content'} //TODO: Set this to 'dark-content' for light background
                translucent={true}
                hidden={Platform.OS === "ios"}
            />

            <TopBar />

            <TabBar navigation={navigation} />

            <SafeAreaView >
                <Text style={styles.header}>Payment :</Text>
                <Button
                    disabled={!loading}
                    title="Checkout"
                    onPress={openPaymentSheet}
                />
            </SafeAreaView>
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
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
