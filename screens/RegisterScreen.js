import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, Image, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import Logo from '../assets/icon-bs.png';
import globalStyles from '../constants/globalStyles';
import { signup } from '../servers/user';

SplashScreen.preventAutoHideAsync();

const RegisterScreen = ({ navigation }) => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
        }, [navigation])
    );

    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required('Name Required'),
        email: Yup.string().email('Invalid email').required('Email Required'),
        password: Yup.string().min(6, 'Too short').required('Password Required'),
    });

    const SubmitHandle = async (values) => {
        const response = await signup(values);
        if (response && response.status) {
            Alert.alert("Success", response.message);
            navigation.navigate("Login")
        } else {
            Alert.alert("Error", response.message || "Signup failed");
        }
    };

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
        <View style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                animated={true}
                backgroundColor="#B1D235"
                statusBarStyle='light-content'
            />
            <View style={[globalStyles.header, { paddingTop: StatusBar.currentHeight + 15 }]}>
                <View style={{ width: Dimensions.get('window').width - 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => navigation.navigate("Main", { screen: "UserAccount" })}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={28} color="#2D2729" />
                    </Pressable>
                    <Text style={{ fontSize: 20, color: '#2D2729', fontFamily: 'popS', textAlign: 'center' }}>Sign up</Text>
                    <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
                </View>
            </View>
            <View style={[globalStyles.container]}>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', paddingVertical: 15 }}>
                    <Text style={{ fontSize: 25, textAlign: 'center', fontFamily: 'popS', color: '#2D2729' }}>Welcome Back</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: 'popM', color: '#2D2729', opacity: 0.5 }}>Sign in to Continue</Text>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => SubmitHandle(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <View>
                                <View style={styles.inputControl}>
                                    <TextInput
                                        placeholder="Full Name"
                                        onChangeText={handleChange('fullname')}
                                        onBlur={handleBlur('fullname')}
                                        value={values.fullname}
                                        style={styles.input}
                                    />
                                    {errors.fullname && <Text style={{ color: 'red' }}>{errors.fullname}</Text>}
                                </View>
                                <View style={styles.inputControl}>
                                    <TextInput
                                        placeholder="Email"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        style={styles.input}
                                    />
                                    {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                                </View>
                                <View style={styles.inputControl}>
                                    <TextInput
                                        placeholder="Password"
                                        secureTextEntry={!isPasswordVisible}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        style={styles.input}
                                    />
                                    <TouchableOpacity style={styles.pwdtoggle} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        {isPasswordVisible ? <MaterialCommunityIcons name="eye-off" style={styles.pwdtoggleicon} /> : <MaterialCommunityIcons name="eye" style={styles.pwdtoggleicon} />}
                                    </TouchableOpacity>
                                    {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
                                </View>
                                <Pressable
                                    onPress={() => handleSubmit()}
                                    style={({ pressed }) => [{ backgroundColor: pressed ? '#2D2729' : '#B1D235' }, globalStyles.btn, styles.fbtn]}
                                >
                                    {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Sign up</Text>)}
                                </Pressable>

                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 15 }}>
                                    <Text style={{ fontSize: 16, textAlign: 'center', color: '#2D2729', fontFamily: 'popM' }}>Already have an account?</Text>
                                    <Text onPress={() => navigation.navigate('Login')} style={{ fontSize: 16, textAlign: 'center', color: '#87aa03', fontFamily: 'popS' }}>Sign in</Text>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </View>
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    contentArea: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    hometext: {
        paddingHorizontal: Platform.OS === 'android' ? 15 : 0,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width,
    },
    fbtn: {
        marginTop: 20,
        width: Dimensions.get('window').width - 30,
    },
    inputControl: {
        position: 'relative'
    },
    input: {
        width: Dimensions.get('window').width - 30,
        backgroundColor: '#f5f5f5',
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        fontWeight: '400',
        color: '#2D2729',
        minHeight: 50,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#d8d8d8'
    },
    pwdtoggle: {
        position: 'absolute',
        top: 32,
        right: 15,
    },
    pwdtoggleicon: {
        fontSize: 24,
        color: '#2D2729',
    }
})