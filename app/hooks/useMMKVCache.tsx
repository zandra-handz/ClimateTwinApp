// import React, { useCallback, useEffect, useState } from 'react';
// import { MMKV } from 'react-native-mmkv'; 

// const storage = new MMKV();

// const useMMKVCache = (key, initialValue = null) => {
//   const [storedValue, setStoredValue] = useState(() => {
//     const item = storage.getString(key);
//     return item ? JSON.parse(item) : initialValue;
//   });

//   const logCache = useCallback(() => {
//     const allKeys = storage.getAllKeys();
//     console.log(`MMKV Cache Updated:`, allKeys.reduce((acc, k) => {
//       acc[k] = JSON.parse(storage.getString(k) || 'null');
//       return acc;
//     }, {}));
//   }, []);

//   const setCache = useCallback((value) => {
//     storage.set(key, JSON.stringify(value));
//     setStoredValue(value);
//     logCache(); // Log cache whenever data is updated
//   }, [key, logCache]);

//   const getCache = useCallback(() => {
//     const item = storage.getString(key);
//     return item ? JSON.parse(item) : null;
//   }, [key]);

//   const clearCache = useCallback(() => {
//     storage.delete(key);
//     setStoredValue(null);
//     logCache(); // Log cache after clearing
//   }, [key, logCache]);

//   // Sync data when app starts
//   useEffect(() => {
//     setStoredValue(getCache());
//     logCache(); // Log cache on mount
//   }, [key, getCache, logCache]);

//   return { storedValue, setCache, getCache, clearCache };
// };

// export default useMMKVCache;
