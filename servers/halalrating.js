import axiosInstance from "../util/axiosInstance";

export const postHalalRating = async (values) => {
    try {
        const response = await axiosInstance.post(`/halalrating/`, values);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { message: "Network error" };
    }
};

export const getHalalRatingsByUid = async (uid, rid) => {
    try {
        const response = await axiosInstance.get(`/halalrating/?uid=${uid}&rid=${rid}`);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { message: "Network error" };
    }
};

export const fetchRatedRestaurantsByUid = async (uid) => {
    try {
        const response = await axiosInstance.get(`/halalrating/?uid=${uid}`, {
            method: "GET",
        })
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const fetchVerifiedRestaurants = async () => {
    try {
        const response = await axiosInstance.get(`/halalrating/`, {
            method: "GET",
        })
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};