import { useQuery, useQueryClient } from "@tanstack/react-query";
 
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import React, { useState, useEffect, useCallback  } from "react";
import { Alert, Platform } from 'react-native';

import Geocoder from "react-native-geocoding";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

Geocoder.init(API_KEY); // Global init

export const useManualLocationTrigger = () => {
  const queryClient = useQueryClient();

  const triggerManualLocation = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        // Ask for permission again
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();

        if (newStatus !== "granted") {
          // If still not granted, suggest going to settings
          Alert.alert(
            "Location Permission Denied",
            "To use this feature, enable location in your device settings.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    Linking.openURL("app-settings:");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
          return;
        }
      }

      // At this point, permission is granted
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0]?.formatted_address || "Unknown Address";

      const formattedData = {
        address,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      };

      const regionData = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      queryClient.setQueryData(["homeLocation"], formattedData);
      queryClient.setQueryData(["homeRegion"], regionData);

      return formattedData;
    } catch (error) {
      console.error("Manual location fetch error:", error);
      throw error;
    }
  }, [queryClient]);

  return {
    triggerManualLocation,
  };
};

// const generateTemporaryId = () => `temp_${Date.now()}`;

const fetchCurrentLocation = async () => {
  Geocoder.init(API_KEY);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;

    const response = await Geocoder.from(latitude, longitude);
    const address = response.results[0]?.formatted_address || "Unknown Address";

    return {
      address,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching current location:", error);
    throw error;
  }
};

export const useGeolocationWatcher = () => {
  const queryClient = useQueryClient();

  const [homeLocation, setHomeLocation] = useState(null);
  const [homeRegion, setHomeRegion] = useState(null);

  Geocoder.init(API_KEY);

  useEffect(() => {
    const watchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }

        const watchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
          },
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await Geocoder.from(latitude, longitude);
              const address =
                response.results[0]?.formatted_address || "Unknown Address";
              const formattedData = {
                address,
                latitude,
                longitude,
                timestamp: new Date().toISOString(),
              };

              const regionData = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              };

              setHomeLocation(formattedData);
              setHomeRegion(regionData);

              queryClient.setQueryData("homeLocation", formattedData);
              queryClient.setQueryData("homeRegion", regionData);
            } catch (geocoderError) {
              console.error(
                "Error fetching address for location:",
                geocoderError
              );
            }
          }
        );

        return () => {
          watchId.remove();
        };
      } catch (error) {
        console.error("Error in geolocation watcher:", error);
      }
    };

    watchLocation();
  }, [queryClient]);

  //faster initial location lat and long access for home screen, using homeLocation which gets from cache for other pages
  return {
    homeLocation,
    homeRegion,
  };
};
export const useCurrentLocationManual = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["homeLocation"],
    queryFn: fetchCurrentLocation, // Fetch location
    staleTime: 1000 * 60 * 5, // Cache for 1 min
    refetchOnWindowFocus: false,

    onSuccess: (data) => {
      console.log("Location query success:", data); // Log success when data is fetched
    },

    onError: (error) => {
      console.error("Location query error:", error);
    },
  });


};

export default useGeolocationWatcher;
