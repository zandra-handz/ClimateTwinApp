 
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import * as Location from 'expo-location';  

import Geocoder from 'react-native-geocoding';
import Constants from 'expo-constants';


const API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;  




const generateTemporaryId = () => `temp_${Date.now()}`;


const fetchCurrentLocation = async () => {
    Geocoder.init(API_KEY);
  try { 
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }
 
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High, 
    });

    console.log('Current location fetched:', location);   
    
    
    const { latitude, longitude } = location.coords;

    // Fetch address (you may need to handle this asynchronously)
    const response = await Geocoder.from(latitude, longitude);
    const address = response.results[0]?.formatted_address || 'Unknown Address';
  
    return {
      
      //id: generateTemporaryId(), 
      address, 
      latitude: location.coords.latitude,
      longitude: location.coords.longitude, 
      timestamp: new Date().toISOString(),
      //title: address, 
     // latitudeDelta: 0.0922,
     // longitudeDelta: 0.0421,
  
    };
  } catch (error) {
    console.error('Error fetching current location:', error); // Log any error
    throw error;
  }
};






export const useGeolocationWatcher = () => {
  const queryClient = useQueryClient();

      // Initialize Geocoder with API key
    Geocoder.init(API_KEY);

  useEffect(() => {
    const watchLocation = async () => {
      try {
        // Request permission to access location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }

        // Start watching the user's location
        const watchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,  
          },
          async (position) => { // Use async function here for geocode call
            console.log('Location updated by watcher:', position);
            const { latitude, longitude } = position.coords;

            try {
              // Fetch address asynchronously
              const response = await Geocoder.from(latitude, longitude);
              const address = response.results[0]?.formatted_address || 'Unknown Address';
                console.log(address);
              // Log the formatted data and set it to the cache
              const formattedData = {
                //id: generateTemporaryId(),
                address,
                latitude,
                longitude,
                timestamp: new Date().toISOString(),
                //title: address, 
                //latitudeDelta: 0.0922,
                //longitudeDelta: 0.0421,
              };

              const regionData = { 
                latitude,
                longitude, 
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              };

              console.log('Formatted Location updated by watcher:', formattedData);

              // Set formatted data in query client cache
              queryClient.setQueryData('homeLocation', formattedData);
              queryClient.setQueryData('homeRegion', regionData);
            
            
            } catch (geocoderError) {
              console.error('Error fetching address for location:', geocoderError);
            }
          }
        );

        // Cleanup function to stop watching location when the component is unmounted
        return () => {
          console.log('Cleaning up geolocation watcher...');
          watchId.remove();
        };
      } catch (error) {
        console.error('Error in geolocation watcher:', error);
      }
    };

    // Start watching the location when component mounts
    watchLocation();

  }, [queryClient]);
};
export const useCurrentLocationManual = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['homeLocation'],  
    queryFn: fetchCurrentLocation,   // Fetch location
    staleTime: 1000 * 60 * 5,  // Cache for 1 min
    refetchOnWindowFocus: false,  

    onSuccess: (data) => {
      console.log('Location query success:', data); // Log success when data is fetched

    },

    onError: (error) => {
      console.error('Location query error:', error);  
    },
  });
};

export default useGeolocationWatcher;

 


