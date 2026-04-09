import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Formik } from "formik";
import React, { useCallback } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Logo from '../assets/icon-bs.png';
import globalStyles from '../constants/globalStyles';

SplashScreen.preventAutoHideAsync();

const SortFilterScreen = () => {

    const route = useRoute();
    const navigation = useNavigation();
    //const [categories, setCategories] = useState({})
    const categories = useSelector((state) => state.categories)
    const search = route?.params?.search || ''

    const sortOptions = [
        { label: 'Open Now', value: 'opennow' },
        { label: 'Recommended', value: 'recommended' }
    ]

    const initialValues = {
        sort: '',
        filter: [],
    }

    const submitSortFilterValues = async (values) => {
        navigation.navigate('ResultRestaurants', {
            search: search,
            sortfilter: values,
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
                animated={true}
                backgroundColor="#B1D235"
                statusBarStyle='light-content'
            />
            <View style={[globalStyles.header, { paddingTop: StatusBar.currentHeight + 15 }]}>
                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={28} color="#2D2729" />
                    </Pressable>
                    <Text style={{ fontSize: 20, color: '#2D2729', fontFamily: 'popS', textAlign: 'center' }}>Search Filters</Text>
                    <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
                </View>
            </View>
            <View style={[globalStyles.container]}>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', paddingVertical: 15 }}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => submitSortFilterValues(values)}
                    >
                        {({ values, handleSubmit, setFieldValue, errors, touched }) => (

                            <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <ScrollView style={styles.box}>
                                    <Text style={{ fontSize: 21, color: "#87aa03", opacity: 0.95, marginBottom: 10, fontFamily: 'popS' }}>Sort</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                                        {sortOptions.map((option, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => setFieldValue("sort", option.value)} // ✅ onPress updates Formik
                                                style={{
                                                    width: (Dimensions.get('window').width - 30) / 2,
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        borderRadius: 10,
                                                        borderWidth: 2,
                                                        borderColor: "#2D2729",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        marginRight: 10,
                                                    }}
                                                >
                                                    {values.sort === option.value && (
                                                        <View
                                                            style={{
                                                                height: 10,
                                                                width: 10,
                                                                borderRadius: 5,
                                                                backgroundColor: "#2D2729",
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                                <Text style={{ fontSize: 16, color: "#2D2729", opacity: 0.95 }}>{option.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {categories?.parent?.filter(item => item.id === 1).map((option, index) => {
                                        const filterCategories = categories.child.filter(item => item.parentId === option.id);
                                        return (<View
                                            key={index}
                                            style={{
                                                alignItems: "flex-start",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 21, color: "#87aa03", opacity: 0.95, marginBottom: 10, fontFamily: 'popS' }}>{option.label}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {filterCategories.map((option) => {
                                                    const isSelected = values.filter.includes(option.id);
                                                    return (
                                                        <TouchableOpacity
                                                            key={option.id}
                                                            onPress={() => {
                                                                if (isSelected) {
                                                                    // remove option
                                                                    setFieldValue("filter", values.filter.filter((h) => h !== option.id));
                                                                } else {
                                                                    // add option
                                                                    setFieldValue("filter", [...values.filter, option.id]);
                                                                }
                                                            }}
                                                            style={{
                                                                width: (Dimensions.get('window').width - 30) / 2,
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                marginBottom: 20,
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    height: 20,
                                                                    width: 20,
                                                                    borderRadius: 4,
                                                                    borderWidth: 2,
                                                                    borderColor: '#2D2729',
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    marginRight: 10,
                                                                    backgroundColor: isSelected ? '#2D2729' : "white",
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <Text style={{ color: "#ffffff", fontSize: 12 }}>✓</Text>
                                                                )}
                                                            </View>
                                                            <Text style={{ fontSize: 16, color: "#2D2729", opacity: 0.95 }}>{option.label}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                                }
                                            </View>
                                        </View>)
                                    })}
                                </ScrollView>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                    <Pressable
                                        onPress={() => handleSubmit()}
                                        style={({ pressed }) => [{ backgroundColor: pressed ? '#2D2729' : '#B1D235' }, globalStyles.btn, styles.fbtn]}
                                    >
                                        {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Submit</Text>)}
                                    </Pressable>
                                    <Pressable
                                        onPress={() => navigation.goBack()}
                                        style={({ pressed }) => [{ backgroundColor: pressed ? '#B1D235' : '#2D2729' }, globalStyles.btn, styles.fbtn]}
                                    >
                                        {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Cancel</Text>)}
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </View>
        </View>
    )
}

export default SortFilterScreen

const styles = StyleSheet.create({
    contentArea: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    box: {
        width: Dimensions.get('window').width - 30,
        /* paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderColor: '#87aa03',
        borderStyle: 'solid',
        borderWidth: 1, */
        marginBottom: 15
    },
    fbtn: {
        width: (Dimensions.get('window').width - 40) / 2,
    },

})