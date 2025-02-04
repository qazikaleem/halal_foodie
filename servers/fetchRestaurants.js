import config from "../config";
import axiosInstance from "../util/axiosInstance";

export const fetchRestaurants = async () => {
    try {
        const response = await axiosInstance.get('/restaurants/', {
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

export const fetchRestaurantsByCoords = async (latitude,longitude) => {
    try {
        const response = await axiosInstance.get(`/restaurants/?latitude=${latitude}&longitude=${longitude}`, {
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

export const fetchRestaurantByCoordsID = async (latitude,longitude,id) => {
    try {
        const response = await axiosInstance.get(`/restaurants/?latitude=${latitude}&longitude=${longitude}&id=${id}`, {
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