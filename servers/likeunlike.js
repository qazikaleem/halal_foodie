import axiosInstance from "../util/axiosInstance";

export const postLikeUnlike = async (uid, rid) => {
    try {
        const response = await axiosInstance.post(`/favouriteres/`, { uid, rid });
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { message: "Network error" };
    }
};

export const checkLikeUnlike = async (uid, rid) => {
    try {
        const response = await axiosInstance.get(`/favouriteres/?uid=${uid}&rid=${rid}`);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { message: "Network error" };
    }
};

export const fetchLikedRestaurants = async (uid) => {
    try {
        const response = await axiosInstance.get(`/favouriteres/?uid=${uid}`, {
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