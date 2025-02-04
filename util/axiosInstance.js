import axios from 'axios';
import config from '../config';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL, // Replace with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up an interceptor to inject the token into headers
axiosInstance.interceptors.request.use(
  (config) => {
    //console.log('Interceptor is called');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
