import { StyleSheet, Text, View, Image, Dimensions, StatusBar, Platform, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState, useEffect } from 'react'
import globalStyles from '../constants/globalStyles'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Logo from '../assets/icon-bs.png'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useDispatch } from 'react-redux'
import { login } from "../redux/authSlice";
import { loginFunc } from "../servers/user";
import { Formik } from 'formik';
import * as Yup from 'yup';

SplashScreen.preventAutoHideAsync();

const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
        }, [navigation])
    );

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email Required'),
        password: Yup.string().min(6, 'Too short').required('Password Required'),
    });

    const LoginHandle = async (values) => {
        const response = await loginFunc(values.email, values.password);
        if (response && response.status) {
            dispatch(login({
                "accessToken": response.accessToken,
                "uid": response.uid
            }));
            navigation.goBack();
        } else {
            Alert.alert("Error", response.message || "Login failed");
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
                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <Pressable onPress={() => navigation.navigate('Main')}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={28} color="#2D2729" />
                    </Pressable>
                    <Text style={{ fontSize: 20, color: '#2D2729', fontFamily: 'popS', textAlign: 'center' }}>Login</Text>
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
                        onSubmit={(values) => LoginHandle(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <View>
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
                                    {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Login</Text>)}
                                </Pressable>

                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 15 }}>
                                    <Text style={{ fontSize: 16, textAlign: 'center', color: '#2D2729', fontFamily: 'popM' }}>Don't have an account?</Text>
                                    <Text onPress={() => navigation.navigate('Register')} style={{ fontSize: 16, textAlign: 'center', color: '#87aa03', fontFamily: 'popS' }}>Register</Text>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </View>
        </View>
    )
}

export default LoginScreen

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
        borderRadius: 12,
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