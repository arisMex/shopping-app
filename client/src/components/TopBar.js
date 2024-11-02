import React, { useContext } from "react";
import { View, Image, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { ThemeContext } from '../contexts/ThemeContext';

const TopBar = () => {
    const { theme, toggleTheme, themeName } = useContext(ThemeContext);
    return (
        <View style={[styles.topBar, theme.topBarTheme]}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
            <TouchableOpacity style={[styles.button, { marginRight: 35, justifyContent: "center", alignItems: 'center' }]} onPress={toggleTheme}>
                {themeName === 'light' ? (
                    <MaterialIcons name="wb-sunny" size={32} color="#FFD700" /> // Sun icon

                ) : (
                    <MaterialIcons name="brightness-2" size={32} color="gray" /> // Moon icon
                )}
                <Text style={[styles.buttonText, { color: themeName === 'light' ? '#FFD700' : 'gray', fontWeight: "bold" }]}>
                    {themeName === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: 'red',
        padding: 10,
        elevation: 5,
        width: "100%",
    },
    logo: {
        width: 80,
        height: 50,
        resizeMode: 'contain',
        marginLeft: 20
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default TopBar;
