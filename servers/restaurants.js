import config from "../config";
import axiosInstance from "../util/axiosInstance";

export const fetchRestaurants = async (page) => {
    try {
        const response = await axiosInstance.get(`/restaurants/?page=${page}`, {
            method: "GET",
        })
        if (response.status === 200) {
            //console.log('all')
            return response.data;
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const fetchRestaurantsByCoords = async (latitude,longitude,page,search="",filter=[]) => {
    try {
        const response = await axiosInstance.get(`/restaurants/?latitude=${latitude}&longitude=${longitude}&page=${page}&search=${search}&filter=${filter.join(",")}`, {
            method: "GET",
        })
        if (response.status === 200) {
            //console.log('coords')
            return response.data;
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const fetchRestaurantByID = async (id) => {
    try {
        const response = await axiosInstance.get(`/restaurants/?id=${id}`, {
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