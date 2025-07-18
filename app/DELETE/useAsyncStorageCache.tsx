// Originally was using this for Groq, but switched to using RQ for Groq. 
// will need to reinstall @react-native-async-storage/async-storage to use
// 
// 
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useState, useEffect, useCallback } from 'react';


// const useAsyncStorageCache = (userId, locationId) => {
//   const cacheKey = `cache_${userId}_${locationId}`;
//   const [storedValue, setStoredValue] = useState(null);
 


//   const setCache = useCallback(async (value) => {
//     try {
//       const jsonValue = JSON.stringify(value);
//       await AsyncStorage.setItem(cacheKey, jsonValue);
//       setStoredValue(value);
   
//      // console.log(`(NOBRIDGE) LOG  AsyncStorage Cache Updated:`, jsonValue);//.slice(0, 100));
//     } catch (error) {
//       console.error('Error saving to cache:', error);
//     }
//   }, [cacheKey]);
  
 
//   const getCache = useCallback(async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(cacheKey);
//       return jsonValue ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error('Error retrieving cache:', error);
//       return null;
//     }
//   }, [cacheKey]);

//   // Function to clear cache
//   const clearCache = useCallback(async () => {
//     try {
//       await AsyncStorage.removeItem(cacheKey);
//       setStoredValue(null);
//       console.log(`(NOBRIDGE) LOG  AsyncStorage Cache Cleared for ${cacheKey}`);
//     } catch (error) {
//       console.error('Error clearing cache:', error);
//     }
//   }, [cacheKey]);

//   // Load cache on mount
//   useEffect(() => {
//     (async () => {
//       const cachedData = await getCache();
//       if (cachedData) {
//         setStoredValue(cachedData);
//       }
//     })();
//   }, [cacheKey, getCache]);

//   return { storedValue, setCache, getCache, clearCache };
// };

// export default useAsyncStorageCache;
