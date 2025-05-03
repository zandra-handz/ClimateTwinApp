import React, {
  createContext, 
  useContext,
  useEffect, 
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location"; 
import Geocoder from "react-native-geocoding";
import Constants from "expo-constants";
import { useUser } from "./UserContext";

const API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

Geocoder.init(API_KEY);

interface DeviceLocation {
  deviceAddress: string | null;
  deviceLatitude: number | null;
  deviceLongitude: number | null;
  deviceRegion: string | null;
}

interface DeviceLocationData {
  deviceLocation: DeviceLocation | undefined;
}

const DeviceLocationContext = createContext<DeviceLocationData | undefined>(
  undefined
);

export const useDeviceLocationContext = () => {
  const context = useContext(DeviceLocationContext);
  if (!context) {
    throw new Error(
      "useDeviceLocationContext must be used within a DeviceLocationProvider"
    );
  }
  return context;
};

export const DeviceLocationProvider: React.FC = ({ children }) => {
  const { user, isAuthenticated, isInitializing } = useUser();
  const queryClient = useQueryClient(); //for saving location to cache
  const [deviceLocation, setDeviceLocation] = useState<
    DeviceLocation | undefined
  >(undefined);

  const [newPermissionRequest, setNewPermissionRequest] = useState<number>(0);

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

              // SET LATER
              // Below is an exmple: only trigger if user moves 10 meters or 5 seconds have passed
              timeInterval: 5000,      // in ms
              distanceInterval: 10,    // in meters
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
  
                setDeviceLocation(formattedData); 
  
                queryClient.setQueryData("deviceLocation", user?.id, formattedData); 

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
    }, [queryClient, newPermissionRequest]);


    const triggerNewPermissionRequest = () => {
        setNewPermissionRequest(Date.now());
    }

  return (
    <DeviceLocationContext.Provider
      value={{
        deviceLocation,
        triggerNewPermissionRequest,
      }}
    >
      {children}
    </DeviceLocationContext.Provider>
  );
}; 
