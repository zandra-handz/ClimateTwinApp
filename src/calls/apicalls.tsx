import axios from "axios"; 
import * as SecureStore from 'expo-secure-store'; 
//export const API_URL = 'https://ac67e9fa-7838-487d-a3bc-e7a176f4bfbf-dev.e1-us-cdp-2.choreoapis.dev/hellofriend/hellofriend/rest-api-be2/v1.0/';

//export const API_URL = 'http://167.99.233.148:8000/';
// export const API_URL = 'https://climatetwin-lzyyd.ondigitalocean.app/';

export const API_URL = 'https://climatetwin.com/';
axios.defaults.baseURL = API_URL;
import { Alert } from 'react-native'; 
 

//websocket token needs to update when the headers do
export const setAuthHeader = (token : string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};
 
export const deleteTokens = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('pushToken');
    await SecureStore.deleteItemAsync('tokenExpiry');
};


export const signout = async () => {
    try {

        await deleteTokens(); // does all the below:
        // await SecureStore.deleteItemAsync('accessToken');
        // await SecureStore.deleteItemAsync('refreshToken');
        // await SecureStore.deleteItemAsync('pushToken');
        // await SecureStore.deleteItemAsync('tokenExpiry');
        setAuthHeader(null);  
        return true;
    } catch (e) {
        console.log("API signout error", e);
        return false;
    }
};

const refreshTokenFunct = async () => { 
    isMakingRefetchCall = true;
    const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!storedRefreshToken) { 
        return null;
    }  
    try {  
        const response = await axios.post('/users/token/refresh/', { refresh: storedRefreshToken });
        if (!response.data || !response.data.access) { 
            return null;
        } 
        const newAccessToken = response.data.access;  
        await SecureStore.setItemAsync('accessToken', newAccessToken); 
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        console.error('Error response:', error.response ? error.response.data : 'No response data');
        console.error('Error status:', error.response ? error.response.status : 'No status');
        return null;
    } finally { 
        isMakingRefetchCall = false; 
    }
};
 
let isRefreshing = false;

let refreshSubscribers = [];

 
const subscribeTokenRefresh = (callback: (newAccessToken: string) => void) => {
    if (callback) {
        refreshSubscribers.push(callback);
    } 
};

const onRefreshed = (newAccessToken: string) => {
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

let isMakingRefetchCall = false;
 
axios.interceptors.response.use(
    (response) => { 
        return response;
    },
    async (error) => {
        const { config, response } = error;
        const originalRequest = config;
       // console.log(isMakingRefetchCall);
 
        if (response && response.status === 401 && !originalRequest._retry && !isMakingRefetchCall) {
            console.log('Interceptor caught a 401!');
           
            if (!isRefreshing) { 
                isRefreshing = true;
                originalRequest._retry = true;
                const newAccessToken : string | null = await refreshTokenFunct(); 

                try {  
                    if (!newAccessToken) { 
                        throw new Error("Failed to refresh token: new access token is null or undefined");
                    } 
                    isRefreshing = false;
                    setAuthHeader(newAccessToken); 
                    onRefreshed(newAccessToken); 
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
        const response = await axios.post('/users/token/', { username, password });
        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh;

        await SecureStore.setItemAsync('accessToken',  newAccessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            
            
        setAuthHeader(newAccessToken); 

        return response; 
        
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


export const sendResetCodeEmail = async (email) => {
  
    try {
        return await axios.post('/users/send-reset-code/', { 'email': email });
    } catch (e) {
        console.log('error sending email:', e);
        return { error: true, msg: e.response.data.msg };
    }
};


export const verifyResetCodeEmail = async ({email, resetCode}) => {
    console.log(email);
    console.log(resetCode);
  
    try {
        response = await axios.post('/users/verify-reset-code/', { 'email': email, 'reset_code': resetCode });
        console.log(response);
        return response;
    } catch (e) {
        console.log('error checking reset code:', e);
        return { error: true, msg: e.response.data.msg };
    }
};

export const resetPassword = async ({email, resetCode, newPassword }) => {
    console.log(email);
    console.log(resetCode);
  
    try {
        response = await axios.post('/users/reset-password/', { 'email': email, 'reset_code': resetCode, 'new_password' : newPassword});
        console.log(response);
        return response;
    } catch (e) {
        console.log('error resetting password:', e);
        return { error: true, msg: e.response.data.msg };
    }
};

export const sendEmail = async (email) => {
  
    try {
        return await axios.post('/users/send-email/', { 'email': email });
    } catch (e) {
        console.log('error sending email:', e);
        return { error: true, msg: e.response.data.msg };
    }
};



export const signup = async ({username, email, password}) => {
    console.log(username);
    console.log(email);
    console.log(password);
  
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
            await SecureStore.setItemAsync('accessToken', result.data.access); 
            setAuthHeader(result.data.access); 
            await SecureStore.setItemAsync('refreshToken', result.data.refresh);
            
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
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/settings/');
        console.log('API GET Call getUserSettings', response.data);
        return response.data;
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

export const getUserPendingRequests = async () => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/pending-requests/');
      //console.log('API GET Call getUserPendingRequests', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/pending-requests/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/pending-requests/:');
        } else {
            console.error('Error message for /users/pending-requests/:');
        }
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/profile/');
        console.log('API GET Call getUserProfile', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/profile/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/profile/:');
        } else {
            console.error('Error message for /users/profile/:');
        }
        throw error;
    }
};

export const getPublicProfile = async (userId : number) => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/get/${userId}/public-profile/`);
        console.log('API GET Call getPublicProfile', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/get/${userId}/public-profile/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/get/${userId}/public-profile/:');
        } else {
            console.error('Error message for /users/get/${userId}/public-profile/:');
        }
        throw error;
    }
};


export const updateUserProfile = async (userId, updatedProfile) => {
    console.log(userId);
   // console.log([...updatedProfile]);
    console.log('Updated Profile:', updatedProfile);

    console.log('Request Headers:', axios.defaults.headers.common);
    try {
        const response = await axios.patch(`/users/profile/update/${userId}/`, updatedProfile,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        console.log('API PATCH CALL updatedProfile', response.data);
        //console.log('API response:', response.data); // Log the response data
        return response.data; // Ensure this returns the expected structure
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
  };

 

  export const uploadUserAvatar = async (userId, formData) => {
    console.log('FormData in uploadUserAvatar:', userId, formData);
    
    try {
        const response = await axios.patch(`/users/profile/update/${userId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Avatar uploaded successfully:', response.data);
        return response.data; // Return the created image data if needed
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error; // Throw error to handle it in component level
    }
};

 



export const getCurrentUser = async () => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/get-current/');
        console.log('API GET Call getCurrentUser'); //, response.data);
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


export const getAllUsers = async () => {
    try {
       console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/get-all/');
        console.log('API GET Call getAllUsers'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/get-all/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/get-all/, , add console logging in api file for more details');
        } else {
            console.error('Error message for /users/get-all/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const searchUsers = async (query : string) => {
    try {
       console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/get/?search=${query}`);
       // console.log('API GET Call searchUsers', response.data);
        return response.data.results;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/get/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/get/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/get/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const searchTreasures = async (query : string) => {
    try {
       console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/treasures/get/?search=${query}`);
       // console.log('API GET Call searchUsers', response.data);
        return response.data.results;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/treasures/get/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/treasures/get/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/treasures/get/, add console logging in api file for more details');
        }
        throw error;
    }
};


// haven't made protected endpoint yet, it will work the same but check the searchable field to ensure can
// be viewed by unassociated parties
export const getSearchableTreasure = async (treasureId) => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/treasure/${treasureId}/`);
       // console.log('API GET Call getTreaure', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/treasure/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/treasure/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/treasure/, add console logging in api file for more details');
        }
        throw error;
    }
};



export const go = async (startingAddress) => {
    const address = {address : startingAddress}
    try {
        console.log(address);
        console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post('/climatevisitor/go/', address); 
        console.log(response.status);
        return response.data[0];
        
    } catch (error) {
        Alert.alert('DEBUG MODE: Request Failed', 'The request could not be sent. Please try again.');
        
        if (error.response) {
            console.error('Error response for /climatevisitor/go/:', error);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/go/:');
        } else {
            console.error('Error message for /climatevisitor/go/:');
        }
        throw error;
    }
};



export const getRemainingGoes = async () => {
    try {
        const response = await axios.get('/climatevisitor/get-remaining-goes/');
        console.log('API GET getRemainingGoes'); //, response.data);
 
        if (response.data) { 
            if (response.data.remaining_goes) {
                return response.data.remaining_goes;
            } else if (response.data.details) {
                return response.data.details;
            }
        }
 
        return 'No remaining goes data';

    } catch (error) { 
        if (error.response) {
            console.error('Error response:', error.response);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
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

  



  export const getLaunchpadData = async () => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
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


 
//NOT BEING USED
  export const getTwinLocation = async () => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
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



import { CurrentSurroundings } from "../types/CurrentSurroundingsContextTypes";  

 
export const getExploreLocation = async (): Promise<CurrentSurroundings> => {
    try { 
        const response = await axios.get('/climatevisitor/currently-exploring/v2/');
        console.log('API GET Call getExploreLocation');//, response.data);
        //console.log(response.data); 
        return response.data as CurrentSurroundings;  
      
    } catch (error: unknown) {   
        if (axios.isAxiosError(error)) { 
            if (error.response) {
                console.error('Error response for /climatevisitor/currently-exploring/v2/:', error.response.data);
            } else if (error.request) {
                console.error('Error request for /climatevisitor/currently-exploring/v2/, add console logging in api file for more details');
            } else {
                console.error('Error message for /climatevisitor/currently-exploring/v2/, add console logging in api file for more details');
            }
        } else { 
            console.error('An unexpected error occurred:', error);
        }
        throw error;  
    }
};


export const getItemChoices = async () => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/climatevisitor/item-choices/');
       // console.log('API GET Call getItemChoices', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/item-choices/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/item-choices/, add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/item-choices/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const collectTreasure = async (data) => {
    try {
        console.log(data);
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post(`/climatevisitor/collect/`, data);
        console.log('API POST Call collectTreaure'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/collect/:', error.response );
        } else if (error.request) {
            console.error('Error request for /climatevisitor/collect/, add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/collect/, add console logging in api file for more details');
        }
        throw error;
    }
};




export const getTreasures = async () => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/treasures/');
        console.log('API GET Call getTreaures');//, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/treasures/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/treasures/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/treasures/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const getOwnerChangeRecords = async (treasureId : string) => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/treasure/${treasureId}/history/`);
       // console.log('API GET Call getOwnerChangeRecords: ', response.data); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/treasure/${treasureId}/history/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/treasure/${treasureId}/history/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/treasure/${treasureId}/history/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const getTreasure = async (treasureId) => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/treasure/${treasureId}/`);
       console.log('API GET Call getTreaure', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/treasure/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/treasure/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/treasure/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const requestToGiftTreasure = async (data) => {
    try {
        console.log(data);
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post(`/users/send-gift-request/`, data);
        console.log('API GET Call getTreaure'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/send-gift-request/:');
        } else if (error.request) {
            console.error('Error request for /users/send-gift-request/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/send-gift-request/, add console logging in api file for more details');
        }
        throw error;
    }
};


// FOR DEVELOPMENT, ONLY SUPERUSER IS AUTHORIZED TO MAKE THIS 
export const cleanTreasuresData = async () => {
    try { 
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post(`/users/clean-treasures-data/`);
        //const response = await axios.post(`/climatevisitor/clean-discoveries-data/`); //TEMP
        console.log('API GET Call cleanTreasuresData'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/clean-treasures-data/:');
        } else if (error.request) {
            console.error('Error request for /users/clean-treasures-data/, add console logging in api file for more details');
        } else {
            console.error('Error message for/users/clean-treasures-data/, add console logging in api file for more details');
        }
        throw error;
    }
};

 

export const requestToGiftTreasureBackToFinder = async (data) => {
    try {
        console.log(data);
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post(`/users/send-gift-request-back-to-finder/`, data);
        console.log('API GET Call getTreaure'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/send-gift-request-back-to-finder/:');
        } else if (error.request) {
            console.error('Error request for /users/send-gift-request-back-to-finder/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/send-gift-request-back-to-finder/, add console logging in api file for more details');
        }
        throw error;
    }
};



// need to paginate on backend
export const getHistory = async () => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/visited-places/'); //summary is an interesting endpoint too
       
        console.log('API GET Call getUserVisits'); //, response.data); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/visits/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/visits/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/visits/, add console logging in api file for more details');
        }
        throw error;
    }
};


//pagination settings for getStats on backend:

// class ClimateTwinStatsPagination(PageNumberPagination):
//     page_size = 30  
//     page_size_query_param = 'page_size'
//     max_page_size = 100 

// {
//     "count": 150,  // Total number of results
//     "next": "http://your-api-url/?page=2",
//     "previous": null,
//     "results": [
//         {
//             "id": 1,
//             "home_temperature": 72.5,
//             "home_address": "New York, NY",
//             "climate_twin_temperature": 75.0,
//             "climate_twin_address": "Los Angeles, CA",
//             ...
//         },
//         ...
//     ]
// }


export const getStats = async () => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/climatevisitor/algo-stats-for-user/'); 
        console.log('API GET Call getStats', response.data.results); //, response.data);
        return response.data.results; //endpoint is paginated, use 'results'
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/visits/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/visits/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/visits/, add console logging in api file for more details');
        }
        throw error;
    }
};




export const getInboxItems = async () => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/inbox/items/');
        console.log('API GET Call getInboxItems'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/inbox/items/:');
        } else if (error.request) {
            console.error('Error request for /users/inbox/items/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/inbox/items/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const getInboxItem = async (id) => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/inbox/item/${id}/`);
        console.log('API GET Call getInboxItem'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/inbox/item/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/inbox/item/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/inbox/item/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const acceptTreasureGift = async (itemViewId) => {
    try { 
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.put(`/users/inbox/accept-gift-request/${itemViewId}/`, {
            "is_accepted": true,
            "message": "Thank you!"  // Optional message
          });
        console.log('API PUT Call acceptTreaureGift'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/inbox/accept-gift-request/:', error.response);
        } else if (error.request) {
            console.error('Error request for /users/inbox/accept-gift-request/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/inbox/accept-gift-request/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const declineTreasureGift = async (itemViewId : number) => {
    try { 
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.put(`/users/inbox/accept-gift-request/${itemViewId}/`, {
            "is_rejected": true, 

          //  "message": "Thank you!"  // Optional message
          });
        console.log('API PUT Call declineTreaureGift'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/inbox/accept-gift-request/:', );
        } else if (error.request) {
            console.error('Error request for /users/inbox/accept-gift-request/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/inbox/accept-gift-request/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const clearNotificationCache = async () => {
    try { 
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post(`/users/clear-notification-cache/`);
        console.log('API POST Call clearNotificationCache'); 
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/clear-notification-cache/:', );
        } else if (error.request) {
            console.error('Error request for /users/clear-notification-cache/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/clear-notification-cache/, add console logging in api file for more details');
        }
        throw error;
    }
};



export const getMessage = async (messageId) => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/message/${messageId}/`);
        console.log('API GET Call getMessage'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/message/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/message/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/message/, add console logging in api file for more details');
        }
        throw error;
    }
};


export const getFriends = async () => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/users/friends/');
        console.log('API GET Call getFriends');//, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/friends/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/friends/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/friends/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const getFriend = async (friendId) => {
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get(`/users/friend/${friendId}/`);
        console.log('API GET Call getFriend'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/friend/${friendId}/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/friend/${friendId}/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/friend/${friendId}/, add console logging in api file for more details');
        }
        throw error;
    }
};



export const requestToAddFriend = async (data : any) => {
    console.log(`friend request data: `, data);
    try { 
          const response = await axios.post(`/users/send-friend-request/`, data);
        console.log('API GET Call requestToAddFriend'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/send-friend-request/:', error.response.data);
        } else if (error.request) {
            console.error('Error request for /users/send-friend-request/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/send-friend-request/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const acceptFriendship = async (itemViewId : number) => {
    try { 
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.put(`/users/inbox/accept-friend-request/${itemViewId}/`, {
            "is_accepted": true,
            "message": "Thank you!"  // Optional message
          });
        console.log('API PUT Call acceptFriendship'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/inbox/accept-friend-request/:', error.response);
        } else if (error.request) {
            console.error('Error request for /users/inbox/accept-friend-request/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/inbox/accept-friend-request/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const declineFriendship = async (itemViewId : number) => {
    try { 
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.put(`/users/inbox/accept-friend-request/${itemViewId}/`, {
            "is_rejected": true, 
            //"is_accepted": false,
          //  "message": "Thank you!"  // Optional message
          });
        console.log('API PUT Call declineFriendship'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/inbox/accept-friend-request/:', );
        } else if (error.request) {
            console.error('Error request for /users/inbox/accept-friend-request/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/inbox/accept-friend-request/, add console logging in api file for more details');
        }
        throw error;
    }
};

export const deleteFriendship = async (itemViewId : number) => {
    try { const response = await axios.delete(`/users/friend/${itemViewId}/delete/`);
        console.log('API POST call deleteFriendship'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/friend/id/delete/:', );
        } else if (error.request) {
            console.error('Error request for /users/inbox/accept-gift-request/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/inbox/accept-gift-request/, add console logging in api file for more details');
        }
        throw error;
    }
};





export const getNearbyLocations = async () => {
    try {
       // console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.get('/climatevisitor/currently-nearby/');
        console.log('API GET Call getNearbyLocations'); //, response.data);
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


export const pickNewSurroundings = async (locationData: { [key: string]: number }) => {
    
    try {
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.post('/climatevisitor/explore/v2/', locationData); //, locationId);
        console.log('API GET Call pickNewSurroundings'); //, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/explore/v2/', error.response.data);
        } else if (error.request) {
            console.error('Error request for /climatevisitor/explore/v2/, add console logging in api file for more details');
        } else {
            console.error('Error message for /climatevisitor/explore/v2/, add console logging in api file for more details');
        }
        throw error;
    }
};




export const expireSurroundings = async () => {
    
    try {   const response = await axios.patch('/climatevisitor/go-home/'); 
        console.log('API PATCH Call expireSurroundings');  
        console.log(response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /climatevisitor/explore/v2/', error.response.data);
        } else {
            console.error('Error message for /climatevisitor/explore/v2/, add console logging in api file for more details');
        }
        throw error;
    }
};
 


export const deleteUserAccount = async () => {
    try { 
      //  console.log('Request Headers:', axios.defaults.headers.common); // Log the headers before the request
        const response = await axios.delete(`/users/delete-account/`);
        console.log('API GET Call deleteUserAccount');  
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response for /users/delete-account/:');
        } else if (error.request) {
            console.error('Error request for /users/delete-account/, add console logging in api file for more details');
        } else {
            console.error('Error message for /users/delete-account/, add console logging in api file for more details');
        }
        throw error;
    }
};
