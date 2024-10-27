import React from "react";
import { View, Image, StyleSheet, Text } from 'react-native';

const TopBar = () => {
    return (
        <View style={styles.topBar}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'red',
        padding: 10,
        elevation: 5, 
        width : "100%", 
    },
    logo: {
        width: 80, 
        height: 50, 
        resizeMode: 'contain', 
        marginLeft:20
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default TopBar;
