import React, {useContext} from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { lightTheme, darkTheme } from '../styles/themes';
import { ThemeContext } from '../contexts/ThemeContext';


const TabBar = ({ navigation }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <View style={[styles.tabBar, theme.tabNavigationBarContainer]}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                <MaterialIcons name="home" size={30} color={theme.iconColor} />
                <Text style={[styles.buttonText, {color: theme.iconColor}]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CartScreen')}>
                <MaterialIcons name="shopping-cart" size={30} color={theme.iconColor} />
                <Text style={[styles.buttonText, {color: theme.iconColor}]}>Panier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scan')}>
                <MaterialIcons name="barcode-reader" size={30} color={theme.iconColor} />
                <Text style={[styles.buttonText, {color: theme.iconColor}]}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
                <MaterialIcons name="history" size={30} color={theme.iconColor} />
                <Text style={[styles.buttonText, {color: theme.iconColor}]}>Historique</Text>
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
        borderTopWidth: 1,
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
