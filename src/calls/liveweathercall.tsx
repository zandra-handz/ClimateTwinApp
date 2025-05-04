import Constants from "expo-constants"; 
 export const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
 
 export const API_KEY = Constants.expoConfig?.extra?.OWM_API_KEY;
   
 
 export const setRequestBody = ({ lat, lon, units=`imperial` }) => {
 
     if (!lat || !lon) {
         console.error("Prompt or role is missing from Groq request body");
         return null;
     }
 
     return {
         lat: lat,
         lon: lon,
         units: units,
         appid: API_KEY,
     };
 };
 
  
 export const getLiveWeather = async ({ lat, lon, units = 'imperial'}) => { 
 
     if (!lat || !lon) {
        console.error("Lat, lon, or units missing from getWeather api call");
        return null;
    }
 
     const url = `${API_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
   //  console.log(url);
     try {
         const response = await fetch(url);
        //  , {
        //      method: "GET",
        //      headers: {
        //          Authorization: API_KEY, // No need for "Bearer"
        //      },
        //  });
 
 
         if (!response.ok) {
             throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
         }
 

         const data = await response.json(); 
         //console.log(`OWM api call to get live weather data: `, data);
       
         return data;
     } catch (error) { 
         return;
     }
 };
 
 