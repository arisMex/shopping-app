import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CartItem({ item, onRemove }) {
    return (
        <View style={styles.container}>
            <Text style={styles.index}>{item.index + 1}.</Text>
            <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>
                    {item.price} € x {item.quantity} = {(item.price * item.quantity).toFixed(2)} €
                </Text>
            </View>
            <TouchableOpacity onPress={() => onRemove(item.barcode)}>
                <MaterialIcons name="delete" size={25} color="red" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    index: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: 'green',
    },
});
