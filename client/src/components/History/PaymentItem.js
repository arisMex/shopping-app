import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const PaymentItem = ({ payment, expanded, toggleExpand, theme }) => {
    return (
        <View style={[styles.paymentContainer, theme.itemCard]}>
            <View style={styles.state}>
                <MaterialIcons name={"payment"} size={15} color="red" style={styles.toggleIcon} />
                <Text style={theme.text}>  Etat: {payment.is_checked ? "Validé" : "Non validé"} </Text>
            </View>

            {payment.is_checked && (
                <View style={styles.state}>
                    <MaterialIcons name={"calendar-today"} size={15} color="red" style={styles.toggleIcon} />
                    <Text style={theme.text}>
                        Date: {payment.checkout_date ? payment.checkout_date.split("T")[0] : "N/A"}
                    </Text>
                </View>
            )}

            <TouchableOpacity onPress={() => toggleExpand(payment.id)} style={styles.toggleButton}>
                <MaterialIcons
                    name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={30}
                    color="red"
                    style={styles.toggleIcon}
                />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.itemsContainer}>
                    {payment.purchased_items.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text style={theme.text}>{index + 1}. {item.item.name}</Text>
                            <Text style={theme.greenText}>{item.item.price}€</Text>
                            <Text style={theme.text}>x {item.amount}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    paymentContainer: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        margin: 16,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: "90%",
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
    state: {
        flexDirection: "row",
    },
    toggleIcon: {
        marginRight: 8,
    },
});
