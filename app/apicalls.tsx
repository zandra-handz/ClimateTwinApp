import axios from 'axios';  
import * as SecureStore from 'expo-secure-store'; 
//export const API_URL = 'https://ac67e9fa-7838-487d-a3bc-e7a176f4bfbf-dev.e1-us-cdp-2.choreoapis.dev/hellofriend/hellofriend/rest-api-be2/v1.0/';

//export const API_URL = 'http://167.99.233.148:8000/';
// export const API_URL = 'https://climatetwin-lzyyd.ondigitalocean.app/';

export const API_URL = 'https://climatetwin.com/';


axios.defaults.baseURL = API_URL;

import { Alert } from 'react-native';






export const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};


const TOKEN_KEY = 'my-jwt';


export const getToken = async () => await SecureStore.getItemAsync(TOKEN_KEY);

export const setToken = async (token) => await SecureStore.setItemAsync(TOKEN_KEY, token);

export const deleteTokens = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('pushToken');
};
//

const refreshTokenFunct = async () => {
    const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!storedRefreshToken) {
        console.warn('No refresh token available');
        return null;  // Return early if there's no refresh token
    }

    try {
        const response = await axios.post('/users/token/refresh/', { refresh: storedRefreshToken });
        const newAccessToken = response.data.access;

        await setToken(newAccessToken);
        await SecureStore.setItemAsync('accessToken', newAccessToken);
       
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing token api file:', error);
        throw error;
    }
};


export const signout = async () => {
    try {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('tokenExpiry');
        setAuthHeader(null); 
        console.log("API signout: Authorization header cleared");
        return true;
    } catch (e) {
        console.log("API signout error", e);
        return false;
    }
};



// Function to handle token refresh
let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to token refresh completion
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

// Notify subscribers after token refresh
const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach(callback => callback(newAccessToken));
    refreshSubscribers = [];
};


// Axios Request Interceptor
axios.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Axios Response Interceptor
axios.interceptors.response.use(

    
    (response) => {
        console.log('Interceptor was here!');
        return response;
    },
    async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        // If the error is a 401 and the request has not been retried yet
        if (response && response.status === 401 && !originalRequest._retry) {
            console.log('Interceptor caught a 401!');
            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshTokenFunct();

                    if (!newAccessToken) {
                        throw new Error("Failed to refresh token: new access token is null or undefined");
                    }
                    console.log('Interceptor acquired new token utilizing refreshTokenFunct!', newAccessToken);
        
                    
                    console.log('Interceptor acquired new token utilizing refreshToken!', newAccessToken);
                    isRefreshing = false;

                    // Update the Authorization header for all queued requests
                    onRefreshed(newAccessToken);
                    setAuthHeader(newAccessToken);
                    await setToken(newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (err) {
                    isRefreshing = false;
                    return Promise.reject(err);
                }
            } else {
                // If token refresh is already in progress, queue the request
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newAccessToken) => {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        resolve(axios(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    } 
);


export const signinWithoutRefresh = async ({ username, password }) => {
    try {
        const result = await axios.post('/users/token/', { username, password });
        console.log(`API POST CALL signinWithoutRefresh`, result);

        if (result.data && result.data.access) {
            console.log("Access token received:", result.data.access);
            setAuthHeader(result.data.access); // Store the token for later use
           
            await setToken(result.data.access);
            return result; // Successful response
        } else {
            throw new Error("Unexpected response format");
        }
    } catch (e) {
        console.error("Error during signinWithoutRefresh:", e);

        if (e.response) {
            console.log("Server responded with:", e.response.data);
            throw new Error(e.response.data.msg || 'Invalid credentials'); // Explicit error for invalid credentials
        } else if (e.request) {
            console.log("No response from server:", e.request);
            throw new Error('No response from server, please check your network');
        } else {
            console.log("Unexpected error:", e.message);
            throw new Error('Unexpected error occurred during signin');
        }
    }
};

//code for auth token i think you need to change 'access'
// export const signinWithoutRefresh = async ({ username, password }) => {
//     try {
//         const result = await axios.post('/auth/token/login/', { username, password });
//         console.log(`API POST CALL signinWithoutRefresh`, result);

//         if (result.data) {
//             console.log("Access token received:", result.data.auth_token);
//             setAuthHeader(result.data.auth_token); // Store the token for later use
//             return result; // Successful response
//         } else {
//             throw new Error("Unexpected response format");
//         }
//     } catch (e) {
//         console.error("Error during signinWithoutRefresh:", e);

//         if (e.response) {
//             console.log("Server responded with:", e.response.data);
//             throw new Error(e.response.data.msg || 'Invalid credentials'); // Explicit error for invalid credentials
//         } else if (e.request) {
//             console.log("No response from server:", e.request);
//             throw new Error('No response from server, please check your network');
//         } else {
//             console.log("Unexpected error:", e.message);
//             throw new Error('Unexpected error occurred during signin');
//         }
//     }
// };


export const signup = async ({username, email, password}) => {
  
    try {
        return await axios.post('/users/sign-up/', { username, email, password });
    } catch (e) {
        console.log('error creating new account:', e);
        return { error: true, msg: e.response.data.msg };
    }
};


export const signin = async ({ username, password }) => {
    //console.log("Signing in with credentials:", { username, password });
    try {
        const result = await axios.post('/users/token/', { username, password });
        console.log(`API POST CALL signin`);
        //console.log("API response received:", result);

        if (result.data && result.data.access) {
            //console.log("Access token:", result.data.access);
            setAuthHeader(result.data.access); // Assuming setAuthHeader is defined elsewhere
            await setToken(result.data.access);
            return result; // Successful response
        } else {
            throw new Error("Unexpected response format");
        }
    } catch (e) {
        console.error("Error during signin:", e); // Log the full error object
        // Check if e.response exists before accessing its properties
        if (e.response) {
            console.log("Server responded with:", e.response.data);
            throw new Error(e.response.data.msg || 'Invalid credentials'); // Explicit rejection
        } else {
            // Handle network errors or other unexpected errors
            console.log("Network error or server not reachable");
            throw new Error('Network error or server not reachable'); // Explicit rejection
        }
    }
};


export const getUserSettings = async () => {
    try {
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/settings/');
        console.log('API GET Call getUserSettings'); //, response.data);
        return response.data[0];
    } catch (error) {
        if (error.response) {
            console.error('Error response for /auth/users/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /auth/users/:');
        } else {
            console.error('Error message for /auth/users/:');
        }
        throw error;
    }
};



export const getCurrentUser = async () => {
    try {
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/get-current/');
        console.log('API GET Call getCurrentUser', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/get-current/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/get-current/, , add console logging in api file for more details');
        } else {
            console.error('Error message for /users/get-current/, add console logging in api file for more details');
        }
        throw error;
    }
};



export const go = async (startingAddress) => {
    const address = {address : startingAddress}
    try {
        //console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post('/climatevisitor/go/', address); 
        console.log(response.status);
        return response.data[0];
        
    } catch (error) {
        Alert.alert('DEBUG MODE: Request Failed', 'The request could not be sent. Please try again.');
        
        if (error.response) {
            console.error('Error response for /auth/users/:', error);
        } else if (error.request) {
            console.error('Error request for /auth/users/:');
        } else {
            console.error('Error message for /auth/users/:');
        }
        throw error;
    }
};
 

export const updateUserSettings = async (userId, updatedSettings) => {
    try {
        const response = await axios.patch(`/users/change-settings/${userId}/`, updatedSettings);
        console.log('API PATCH CALL updateUserSettings', response.data);
        //console.log('API response:', response.data); // Log the response data
        return response.data; // Ensure this returns the expected structure
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
  };



  export const getLaunchPadData = async () => {
    try {
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/climatevisitor/launchpad-data/');
        console.log('API GET Call launchPadData', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/launchpad-data/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/launchpad-data/ , add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/launchpad-data/, add console logging in api file for more details');
        }
        throw error;
    }
};


 

  export const getTwinLocation = async () => {
    try {
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/climatevisitor/currently-visiting/');
        console.log('API GET Call matchedLocation', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/currently-visiting/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/currently-visiting/, , add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/currently-visiting/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const getExploreLocation = async () => {
    try {
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/climatevisitor/currently-exploring/');
        console.log('API GET Call getExploreLocation', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/currently-exploring/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/currently-exploring/, add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/currently-exploring/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const getNearbyLocations = async () => {
    try {
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/climatevisitor/currently-nearby/');
        console.log('API GET Call getNearyLocations', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/currently-nearby/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/currently-nearby/, add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/currently-nearby/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const exploreLocation = async (locationId) => {
    console.log(locationId);
    try {
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post('/climatevisitor/explore/', locationId);
        console.log('API GET Call getNearyLocations', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/explore/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/explore/, add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/explore/, add console logging in api file for more details');
        }
        throw error;
    }
};
 