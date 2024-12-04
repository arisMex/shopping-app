import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScanner({ handleBarCodeScanned, setScanned, scanned }) {
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    if (hasPermission === null) {
        return <View><Text>Requesting for camera permission...</Text></View>;
    }

    if (hasPermission === false) {
        return <View><Text>No access to camera</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                onBarCodeScanned={scanned ? undefined : (barcode) => {
                    handleBarCodeScanned(barcode);
                    setScanned(true);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
    },
});
