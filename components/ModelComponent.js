import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback } from 'react';
import { Dimensions, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from '../constants/globalStyles';

SplashScreen.preventAutoHideAsync();

const ModelComponent = ({ visible, onDismiss, heading, subheading, children }) => {

    const [isLoaded] = useFonts({
        "popR": require("../assets/fonts/Poppins-Regular.ttf"),
        "popM": require("../assets/fonts/Poppins-Medium.ttf"),
        "popS": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "popB": require("../assets/fonts/Poppins-Bold.ttf")
    });

    const handleOnLayout = useCallback(async () => {
        if (isLoaded) {
            await SplashScreen.hideAsync(); //hide the splashscreen
        }
    }, [isLoaded]);

    if (!isLoaded) {
        return null;
    }

    return (
        <Modal
            onLayout={handleOnLayout}
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onDismiss}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    marginBottom: 0,
                    marginTop: 0,
                    height: '100%',
                }}>
                    <View style={{
                        height: '50%',
                        marginTop: 'auto',
                        backgroundColor: '#ffffff',
                        borderTopStartRadius: 25,
                        borderTopEndRadius: 25
                    }}>
                        <View style={globalStyles.container}>
                            <View style={{ paddingVertical: 15 }}>
                                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <View>
                                        <Text style={{ fontSize: 20, fontFamily: 'popS' }}>{heading}</Text>
                                        {subheading && <Text style={{ fontSize: 15, fontFamily: 'popM', opacity: 0.5 }}>{subheading}</Text>}
                                    </View>
                                    <Pressable onPress={onDismiss}>
                                        <SimpleLineIcons name="close" size={28} color="#2D2729" />
                                    </Pressable>
                                </View>
                                {children}
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}
export default ModelComponent