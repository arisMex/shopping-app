import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function InputBarCode({
    number,
    onChangeNumber,
    onManualAdd,
    isDisabled
}) {
    return (
        <View style={styles.container}>
            {/* InputBar component */}
            <InputBar
                value={number}
                onChangeText={onChangeNumber}
                onManualAdd={onManualAdd}
                isDisabled={isDisabled}
            />

            {/* Barcode TextInput */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholder="Saisir le code bar ..."
                    placeholderTextColor="gray"
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={[styles.button, isDisabled && styles.disabledButton]}
                    onPress={isDisabled ? null : () => onManualAdd(number)}
                >
                    <MaterialIcons name="add" size={20} color={isDisabled ? 'gray' : 'white'} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        alignItems: 'center',
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
    },
    button: {
        marginLeft: 10,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    icon: {
        color: 'white',
    },
});
