import axiosInstance from "../util/axiosInstance";

export const signup = async (userData) => {
    try {
        const response = await axiosInstance.post(`/users/`, userData);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { message: "Network error" };
    }
};

// Login function
export const loginFunc = async (email, password) => {
    try {
        const response = await axiosInstance.post(`/users/auth/`, { email, password });
        if (response.data.status) {
            const token = response.data.accessToken
            try {
                const response = await axiosInstance.request(`/users/validate/`, {
                    headers: { Authorization: `${token}` },
                });
                response.data.accessToken = token
                //console.log("Login", response.data)
                return response.data;
            } catch (error) {
                return error.response ? error.response.data : { message: "Network error" };
            }
        }
    } catch (error) {
        return error.response ? error.response.data : { message: "Network error" };
    }
};

export const fetchUserDataByID = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/?id=${id}`);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { message: "Network error" };
    }
};