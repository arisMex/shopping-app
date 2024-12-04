import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CartSummary({ totalPrice, itemCount }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Total Price: {totalPrice.toFixed(2)} €</Text>
            <Text style={styles.text}>
                {itemCount} {itemCount !== 1 ? 'items' : 'item'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    text: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
