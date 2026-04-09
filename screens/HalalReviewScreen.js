import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { Formik } from "formik"
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Dimensions, Image, Pressable, StatusBar, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import * as Yup from "yup"
import FilterList from '../assets/filter-list.png'
import Logo from '../assets/icon-bs.png'
import globalStyles from '../constants/globalStyles'
import { getHalalRatingsByUid, postHalalRating } from '../servers/halalrating'

SplashScreen.preventAutoHideAsync();

const HalalReviewScreen = () => {

    const accessToken = useSelector((state) => state.auth.accessToken);
    const uid = useSelector((state) => state.auth.uid);
    const route = useRoute();
    const rid = route.params.rid
    const resname = route.params.resname
    const location = useSelector((state) => state.location)
    const navigation = useNavigation();
    const { currentLocation, latitude, longitude } = location

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("")
    const [ratingData, setRatingData] = useState({})
    const [search, setSearch] = useState('')

    useEffect(() => {
        uid !== null && getHalalRatingsByUidHandle();
    }, [accessToken]);

    const getHalalRatingsByUidHandle = useCallback(async () => {
        try {
            const response = await getHalalRatingsByUid(uid, rid);
            if (response) {
                setRatingData(response)
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }, [accessToken]);

    //console.log("ratingData", ratingData)

    const { ratingOptions, remark_1, remark_2, verifiedDate } = ratingData;

    const initialValues = {
        ratingValues: ratingOptions || [],
        remark_1: remark_1 || '',
        remark_2: remark_2 || ''
    }

    const FormattedVerifiedDate = new Date(verifiedDate).toLocaleDateString("en-AU", {
        timeZone: "Australia/Sydney",
    });

    const options = [
        {
            "sign": "1",
            "info": "HALAL BEEF SERVED AT PREMISES",
            "opt": 1,
        },
        {
            "sign": "1",
            "info": "HALAL MUTTON SERVED AT PREMISES",
            "opt": 2,
        },
        {
            "sign": "1",
            "info": "HALAL CHICKEN HAND SLAUGHTERED",
            "opt": 3,
        },
        {
            "sign": "½",
            "info": "HALAL CHICKEN NOT HAND SLAUGHTERED",
            "opt": 4,
        },
        {
            "sign": "½",
            "info": "NO ALCOHOL SERVED AT PREMISES",
            "opt": 5,
        },
        {
            "sign": "1",
            "info": "NO PORK SERVED AT PREMISES",
            "opt": 6,
        }
    ]

    const validationSchema = Yup.object().shape({
        ratingValues: Yup.array()
            .min(1, "Please enable at least one option")
            .required("Please enable at least one option"),
    });

    const submitHalalReview = async (values) => {
        values.rid = rid
        values.uid = uid

        //console.log("Submitted:", values)

        setLoading(true);
        if (accessToken) {
            try {
                const response = await postHalalRating(values);
                if (response) {
                    setMsg(response.message)
                    console.log("success", response.message)
                    Alert.alert(
                        "Success",
                        response.message,
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate('SingleRestaurant', {
                                    id: rid,
                                    currentLocation: currentLocation,
                                    latitude: latitude,
                                    longitude: longitude
                                }),
                            },
                        ],
                        { cancelable: false }
                    );
                }

            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false)
            }
        } else {
            Alert.alert(
                "Login",
                "This action needs to be ....",
                [
                    {
                        text: "Skip",
                        style: "cancel",
                    },
                    {
                        text: "Login",
                        onPress: () => navigation.navigate("Login"),
                    },
                ],
                { cancelable: false }
            );

        }
        setLoading(false);
    }

    const SearchLocationHandle = () => {
        navigation.navigate('SearchLocation')
    }

    const handleSearch = (value) => {
        navigation.navigate('ResultRestaurants', {
            search: value,
        })
    }

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
                translucent
                backgroundColor="#B1D235"
                statusBarStyle='light-content'
            />
            <View style={[globalStyles.header, { paddingTop: StatusBar.currentHeight + 15 }]}>
                {currentLocation && <Pressable onPress={() => SearchLocationHandle()} style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <View>
                        <Entypo name="location" size={24} color="#2D2729" />
                    </View>
                    <View style={{ width: Dimensions.get('window').width - 120 }}>
                        <Text style={{ fontSize: 12, color: '#FFFFFF', fontFamily: 'popS' }}>Use your Current or Search any Location</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ flex: 1, marginRight: 5, fontSize: 14, color: '#2D2729', fontFamily: 'popS' }} numberOfLines={1} ellipsizeMode="tail">{currentLocation}</Text><Entypo name="chevron-thin-right" size={15} color="#2D2729" />
                        </View>
                    </View>
                    <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
                </Pressable>}
                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
                    <View style={styles.searchContainer}>
                        <Pressable style={styles.textInput} onPress={() => navigation.navigate('ResultRestaurants', { search: '' })}><Text style={{ paddingHorizontal: 4, paddingVertical: 8, fontSize: 16, opacity: 0.55 }}>Search by restaurant</Text></Pressable>
                        <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
                    </View>
                    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => navigation.navigate('SortFilter')}>
                        <Image source={FilterList} style={{ maxWidth: 30, height: 30 }} />
                    </Pressable>
                </View>
            </View>
            <View style={[globalStyles.container]}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    enableOnAndroid={true}
                    extraScrollHeight={40}   // push up more when focused
                    keyboardShouldPersistTaps="handled"
                >
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={(values) => submitHalalReview(values)}
                    >
                        {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched }) => (
                            <View style={{ width: Dimensions.get('window').width, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }}>
                                <View style={styles.heading}>
                                    <Text style={styles.headingPreTxt}>Provide Halal Rating on</Text>
                                    <Text style={styles.headingTxt}>{resname}</Text>
                                    {verifiedDate && <Text style={[styles.headingPreTxt, { color: '#747172ff' }]}>* Already You verified on{" "}{FormattedVerifiedDate}</Text>}
                                </View>
                                {options.map((option, index) => {
                                    const isOn = values.ratingValues.includes(option.opt)
                                    return (
                                        <View key={index} style={styles.card}>
                                            <View style={styles.cardTitle}>
                                                <Text style={styles.cardTitleTxt}>{option.info}</Text>
                                            </View>
                                            <Switch
                                                style={styles.rating}
                                                trackColor={{ false: '#747172ff', true: '#c9ee44ff' }}
                                                thumbColor={isOn ? '#B1D235' : '#2D2729'}
                                                ios_backgroundColor="#B1D235"
                                                value={isOn}
                                                onValueChange={(val) => {
                                                    if (val) {
                                                        setFieldValue("ratingValues", [...values.ratingValues, option.opt]);
                                                    } else {
                                                        setFieldValue(
                                                            "ratingValues",
                                                            values.ratingValues.filter((item) => item !== option.opt)
                                                        );
                                                    }
                                                }}
                                            />
                                            {/* <View style={styles.cartOption}>
                                                <View style={styles.cardLable}><Text style={styles.cardLableTxt}>{option.sign}  <Entypo name="star" style={styles.cardRating} /></Text></View>
                                            </View> */}
                                        </View>
                                    );
                                })}
                                {/* {errors.ratingValues && touched.ratingValues && (
                                    <Text style={{ color: "red", marginBottom: 15, textAlign: 'center', width: Dimensions.get('window').width - 30 }}>{errors.ratingValues}</Text>
                                )} */}
                                <View style={styles.cartAlt}>
                                    <View style={styles.cardTitleAlt}>
                                        <Text style={styles.cardTitleTxt}>If alcohol or pork served at premises, are there steps taken to avoid cross-contamination?</Text>
                                    </View>
                                    <TextInput
                                        editable
                                        multiline
                                        numberOfLines={4}
                                        maxLength={120}
                                        onChangeText={handleChange("remark_1")}
                                        onBlur={handleBlur("remark_1")}
                                        value={values.remark_1}
                                        style={styles.textInput}
                                        placeholder="Enter here..."
                                    />
                                </View>
                                <View style={styles.cartAlt}>
                                    <View style={styles.cardTitleAlt}>
                                        <Text style={styles.cardTitleTxt}>Are all ingredients such as emulsifiers or flavor enhancers used in dishes halal certified or suitable for halal?</Text>
                                    </View>
                                    <TextInput
                                        editable
                                        multiline
                                        numberOfLines={4}
                                        maxLength={120}
                                        onChangeText={handleChange("remark_2")}
                                        onBlur={handleBlur("remark_2")}
                                        value={values.remark_2}
                                        style={styles.textInput}
                                        placeholder="Enter here..."
                                    />
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                                    <Pressable
                                        onPress={() => {
                                            if (Object.keys(errors).length > 0) {
                                                const firstError = Object.values(errors)[0];
                                                Alert.alert("Error", firstError);
                                            } else {
                                                handleSubmit();
                                            }
                                        }}
                                        style={({ pressed }) => [{ backgroundColor: pressed ? '#2D2729' : '#B1D235' }, globalStyles.btn, styles.fbtn]}
                                    >
                                        {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Submit</Text>)}
                                    </Pressable>
                                    <Pressable
                                        onPress={() => navigation.navigate('SingleRestaurant', {
                                            id: rid,
                                            currentLocation: currentLocation,
                                            latitude: latitude,
                                            longitude: longitude
                                        })}
                                        style={({ pressed }) => [{ backgroundColor: pressed ? '#B1D235' : '#2D2729' }, globalStyles.btn, styles.fbtn]}
                                    >
                                        {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Cancel</Text>)}
                                    </Pressable>
                                </View>
                            </View>)}
                    </Formik>
                </KeyboardAwareScrollView>
            </View>
        </View >
    )
}

export default HalalReviewScreen

const styles = StyleSheet.create({
    infoArea: {
        backgroundColor: '#B1D235',
    },
    heading: {
        paddingBottom: 10,
        width: Dimensions.get('window').width - 30,
        paddingVertical: 15,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#e5e5e7',
        borderStyle: 'solid',
    },
    lastHeading: {
        marginBottom: 0,
        borderBottomWidth: 0
    },
    headingPreTxt: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'popM',
        color: '#2D2729',
        textAlign: 'center',
    },
    headingTxt: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'popB',
        color: '#2D2729',
        textAlign: 'center',
    },
    card: {
        width: Dimensions.get('window').width - 30,
        display: 'flex',
        gap: 0,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#454955',
        borderStyle: 'solid',
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cartAlt: {
        width: Dimensions.get('window').width - 30,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#454955',
        borderStyle: 'solid',
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    lastCard: {
        marginBottom: 30
    },
    cardLable: {
        width: 55,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#fde635',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLableTxt: {
        color: '#2D2729',
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'popS',
        textAlign: 'center',
    },
    cardRating: {
        color: '#2D2729',
        fontSize: 15,
    },
    cardTitle: {
        width: Dimensions.get('window').width - 90,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f3eff5',
        borderRightWidth: 1,
        borderColor: '#454955',
        borderStyle: 'solid',
    },
    rating: {
        width: Dimensions.get('window').width - 330,
        margin: '0 auto'
    },
    cardTitleAlt: {
        width: Dimensions.get('window').width - 30,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f3eff5',
        borderRightWidth: 1,
        borderColor: '#454955',
        borderStyle: 'solid',
    },
    cartOption: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitleTxt: {
        color: '#2D2729',
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'popS',
    },
    textInput: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    fbtn: {
        width: (Dimensions.get('window').width - 40) / 2,
    },
    searchContainer: {
        width: Dimensions.get('window').width - 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#B1D235',
    },
    textInput: {
        width: Dimensions.get('window').width - 120,
        height: 40,
        fontSize: 16,
        lineHeight: 20
    },
    filterbtn: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        backgroundColor: '#B1D235',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#B1D235',
    },
    searchTextInput: {
        width: Dimensions.get('window').width - 70,
        height: 40,
        fontSize: 16,
        lineHeight: 20
    },
})