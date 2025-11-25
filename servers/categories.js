import axiosInstance from "../util/axiosInstance";

export const fetchCategories = async () => {
    try {
        const response = await axiosInstance.get(`/categories/`, {
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