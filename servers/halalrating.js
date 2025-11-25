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