import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ErrorBanner({ errorText }) {
    return (
        <View style={styles.container}>
            <MaterialIcons name="warning" size={20} color="red" style={styles.icon} />
            <Text style={styles.text}>{errorText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        margin: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    text: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
