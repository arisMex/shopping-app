import React from 'react';
import { Image, StyleSheet } from 'react-native';

export const EmptyHistory = () => {
    return (
        <Image
            source={require("./../../../assets/empty_cart.png")}
            style={styles.image}
            resizeMode="cover"
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 200,
        alignSelf: "center",
    },
    camera: {
        width: '85%',
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 50,
        borderRadius: 10,
        overflow: 'hidden',
    },
});
