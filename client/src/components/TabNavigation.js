import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const TabBar = ({ navigation }) => {
    return (
        <View style={styles.tabBar}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                <MaterialIcons name="home" size={30} color="white" />
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Panier')}>
                <MaterialIcons name="shopping-cart" size={30} color="white" />
                <Text style={styles.buttonText}>Panier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scan')}>
                <MaterialIcons name="barcode-reader" size={30} color="white" />
                <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
                <MaterialIcons name="history" size={30} color="white" />
                <Text style={styles.buttonText}>Historique</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'center',
        paddingVertical: Platform.OS === "ios" ? 15 : 10,
        backgroundColor: "red",
        borderTopWidth: 1,
        borderColor: "red",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 12, 
        marginTop: 5, 
    },
});

export default TabBar;
