import { TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux'
import { postLikeUnlike, checkLikeUnlike } from "../servers/likeunlike";

const LikeBtnComponent = ({ rid }) => {
    const navigation = useNavigation();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const uid = useSelector((state) => state.auth.uid);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        uid !== null && checkLikeUnlikeHandle();
    }, [accessToken]);

    const checkLikeUnlikeHandle = useCallback(async () => {
        try {
            const response = await checkLikeUnlike(uid, rid);
            if (response && response.status) {
                setLiked(true)
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }, [accessToken]);

    const handleLikeUnlike = async () => {
        setLoading(true);
        if (accessToken) {
            try {
                const response = await postLikeUnlike(uid, rid);
                if (response && response.status) {
                    setLiked((prevLiked) => !prevLiked);
                }

            } catch (error) {
                console.error("Error:", error);
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
    };

    return (
        <TouchableOpacity onPress={handleLikeUnlike} disabled={loading} style={{ flexDirection: "row", alignItems: "center" }}>
            {loading ? (
                <ActivityIndicator size={28} color="#ffffff" style={{ padding: 10 }} />
            ) : (
                <MaterialCommunityIcons name={liked ? "heart" : "heart-outline"} size={28} color={liked ? "#B1D235" : "#ffffff"} style={{ padding: 10 }} />
            )}
        </TouchableOpacity>
    )
}

export default LikeBtnComponent