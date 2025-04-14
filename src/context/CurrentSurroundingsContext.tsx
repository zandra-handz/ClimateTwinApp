import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useUser } from "./UserContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";
import { getExploreLocation, pickNewSurroundings } from "../calls/apicalls";

// Import types from your shared types file
import { CurrentSurroundings, PortalSurroundings, RuinsSurroundings, HomeSurroundings, RawTwinLocation, RawHomeLocation, RawRuinsLocation } from "../types/CurrentSurroundingsContextTypes"; 

import { useSurroundingsWS } from "./SurroundingsWSContext";
import { useGroqContext } from "./GroqContext";

interface CurrentSurroundingsContextType {
  currentSurroundings: CurrentSurroundings | null | undefined;
  locationId: number | null;
  isExploring: boolean;
  portalSurroundings: PortalSurroundings | null;  // Assuming this is the transformed type
  homeSurroundings: HomeSurroundings | null;    // Use the transformed HomeLocation type
  ruinsSurroundings: RuinsSurroundings | null;   
  lastAccessed: string | null;                 // Or the appropriate type for lastAccessed
  handlePickNewSurroundings: () => void;      
  pickNewSurroundingsMutation: () => void;    
  triggerSurroundingsRefetch: () => void;      
  isInitializingLocation: boolean;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurrentSurroundingsContext = createContext<CurrentSurroundingsContextType | undefined>(undefined);

export const useSurroundings = (): CurrentSurroundingsContextType => {
  const context = useContext(CurrentSurroundingsContext);
  if (!context) {
    throw new Error(
      "useSurroundings must be used within a CurrentSurroundingsProvider"
    );
  }
  return context;
};

interface CurrentSurroundingsProviderProps {
  children: ReactNode;
}

export const CurrentSurroundingsProvider: React.FC<CurrentSurroundingsProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isInitializing } = useUser();
  const { extendGroqStaleTime, logGroqState } = useGroqContext();
  const segments = useSegments();
  const queryClient = useQueryClient();
  const { lastState, lastLocationId } = useSurroundingsWS();
  const timeoutRef = useRef(null); 

  // Use the types directly from the imports
  const [portalSurroundings, setPortalSurroundings] = useState<PortalSurroundings | null>(null);
  const [ruinsSurroundings, setRuinsSurroundings] = useState<RuinsSurroundings | null>(null);
  const [homeSurroundings, setHomeSurroundings] = useState<HomeSurroundings | null>(null);

  const [locationId, setLocationId] = useState<number | null>(null);
  const [lastAccessed, setLastAccessed] = useState<string | null>(null);
  const [isExploring, setIsExploring] = useState<boolean>(false);
  const [wasPrevExploring, setWasPrevExploring] = useState<boolean>(false);
  const [isInitializingLocation, setIsInitializingLocation] = useState<boolean>(false);

  const router = useRouter();

 


const {
  data: currentSurroundings,
  isLoading,
  isFetching,
  isPending, //isPending is what works, isLoading and isFetching don't do anything in the useEffect
  isError,
  error,
  isSuccess,
} = useQuery<CurrentSurroundings | null>({
  queryKey: ["currentSurroundings", lastLocationId, lastState],
  queryFn: getExploreLocation,
  enabled: !!isAuthenticated && !isInitializing && (lastState !== 'home') && (lastState !== 'searching for twin'),
 // staleTime: 0,

  // DEPRECATED!!

  // onError: (err: Error) => {
  //   console.error("Error fetching location data:", err);
  // },
  // onSuccess: (data) => {
  //   if (data) {
  //     console.log("Data fetched successfully", data);
  //   }
  // },
});



// FOR DEBUGGING
// useEffect(() => { 
//   if (isError) {
//     console.log('current surroundings is error!');
//   }
// }, [isError]);


// FOR DEBUGGING
// useEffect(() => {
//   if (isSuccess) {
//     console.log('current surroundings is success!');
//   }
// }, [isSuccess]);


  useEffect(() => {
    if (isPending) { 

      // FOR DEBUGGING
      // console.log('seeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeetting is initializing current surroundings to true!');
      setIsInitializingLocation(true);
       
    }
  }, [isPending]);


  // RESET
useEffect(() => {
  if (!isAuthenticated) {
    
   // queryClient.removeQueries({ queryKey: ["currentSurroundings", lastLocationId, lastLocationName] });
    queryClient.removeQueries({ queryKey: ["currentSurroundings", lastLocationId, lastState] });
    setPortalSurroundings(null);
    setRuinsSurroundings(null);
    setHomeSurroundings(null);
    setLocationId(null);
    setLastAccessed(null);
    setIsExploring(false);
    setWasPrevExploring(false);
  }
}, [isAuthenticated]);
 

  useEffect(() => {
    console.log('main initializer use effect in surroundings triggered');
  
    //setIsInitializingLocation(true); now in isPending useEffect so that this sets when call is made not adter it succeeds
    let portalSurroundingsData: PortalSurroundings | null = null;
    let ruinsSurroundingsData: RuinsSurroundings | null = null;
    let homeSurroundingsData: HomeSurroundings | null = null;
 
    if (currentSurroundings && currentSurroundings?.last_accessed && !currentSurroundings.is_expired) { 
      setLastAccessed(currentSurroundings.last_accessed);
      const { twin_location, explore_location } = currentSurroundings;

      if (twin_location && twin_location?.id) {
        const { home_location } = twin_location;
        portalSurroundingsData = {
          name: twin_location.name || "N/A",
          id: twin_location.id,
          lastAccessed: twin_location.last_accessed || "",
          temperature: twin_location.temperature || 0,
          description: twin_location.description || "",  
          windSpeed: twin_location.wind_speed || 0,  
          windDirection: twin_location.wind_direction || 0, 
          humidity: twin_location.humidity || 0, 
          pressure: twin_location.pressure || 0, 
          cloudiness: twin_location.cloudiness || 0, 
          sunriseTimestamp: twin_location.sunrise_timestamp || 0, 
          sunsetTimestamp: twin_location.sunset_timestamp || 0, 
          latitude: twin_location.latitude || 0, 
          longitude: twin_location.longitude || 0, 
          windFriends: twin_location.wind_friends || "", 
          specialHarmony: twin_location.special_harmony || false, 
          details: twin_location.details || "", 
          experience: twin_location.experience || "", 
          windSpeedInteraction: twin_location.wind_speed_interaction || "", 
          pressureInteraction: twin_location.pressure_interaction || "", 
          humidityInteraction: twin_location.humidity_interaction || "", 
          strongerWindInteraction:
            twin_location.stronger_wind_interaction || "", 
          expired: twin_location.expired || false, 
        };

        homeSurroundingsData = {
          name: home_location.name || "",
          id: home_location.id || null,
          lastAccessed: home_location.last_accessed || "",
          temperature: home_location.temperature || 0,
          description: home_location.description || "",
          windSpeed: home_location.wind_speed || 0,
          windDirection: home_location.wind_direction || 0,
          humidity: home_location.humidity || 0,
          pressure: home_location.pressure || 0,
          cloudiness: home_location.cloudiness || 0,
          sunriseTimestamp: home_location.sunrise_timestamp || 0,
          sunsetTimestamp: home_location.sunset_timestamp || 0,
          latitude: home_location.latitude || 0,
          longitude: home_location.longitude || 0,
        };

        // Fields for RuinsLocation if twin_location is present (can leave null if not used)
        ruinsSurroundingsData = {
          name: "",
          id: null,
          directionDegree: 0,
          direction: "",
          milesAway: 0,
          //locationId: 0,
          latitude: 0,
          longitude: 0,
          tags: {},
          windCompass: "",
          windAgreementScore: 0,
          windHarmony: false,
          streetViewImage: "",
        };
        setPortalSurroundings(portalSurroundingsData);
        setRuinsSurroundings(ruinsSurroundingsData);
        setHomeSurroundings(homeSurroundingsData); 
        
        setLocationId(twin_location.id);
        setIsExploring(!!twin_location.id);

      } else if (explore_location && explore_location?.id) {
        const { origin_location } = explore_location;
        const { home_location } = origin_location;

        // Fields for PortalLocation if explore_location is present (can leave null if not used)
        portalSurroundingsData = {
          name: origin_location.name || "N/A",
          id: origin_location.id, 
          lastAccessed: origin_location.last_accessed || "", 
          temperature: origin_location.temperature || 0, 
          description: origin_location.description || "", 
          windSpeed: origin_location.wind_speed || 0, 
          windDirection: origin_location.wind_direction || 0, 
          humidity: origin_location.humidity || 0, 
          pressure: origin_location.pressure || 0, 
          cloudiness: origin_location.cloudiness || 0, 
          sunriseTimestamp: origin_location.sunrise_timestamp || 0, 
          sunsetTimestamp: origin_location.sunset_timestamp || 0, 
          latitude: origin_location.latitude || 0, 
          longitude: origin_location.longitude || 0, 
          windFriends: origin_location.wind_friends || "", 
          specialHarmony: origin_location.special_harmony || false, 
          details: origin_location.details || "", 
          experience: origin_location.experience || "", 
          windSpeedInteraction: origin_location.wind_speed_interaction || "", 
          pressureInteraction: origin_location.pressure_interaction || "", 
          humidityInteraction: origin_location.humidity_interaction || "", 
          strongerWindInteraction:
            origin_location.stronger_wind_interaction || "", 
          expired: origin_location.expired || false, 
        };

        homeSurroundingsData = {
          name: home_location.name || "",
          id: home_location.id || null,
          lastAccessed: home_location.last_accessed || "",
          temperature: home_location.temperature || 0,
          description: home_location.description || "",
          windSpeed: home_location.wind_speed || 0,
          windDirection: home_location.wind_direction || 0,
          humidity: home_location.humidity || 0,
          pressure: home_location.pressure || 0,
          cloudiness: home_location.cloudiness || 0,
          sunriseTimestamp: home_location.sunrise_timestamp || 0,
          sunsetTimestamp: home_location.sunset_timestamp || 0,
          latitude: home_location.latitude || 0,
          longitude: home_location.longitude || 0,
        };

        // Fields for RuinsLocation if explore_location is present
        ruinsSurroundingsData = {
          name: explore_location.name || "",
          id: explore_location.id || 0,
          directionDegree: explore_location.direction_degree || 0,
          direction: explore_location.direction || "",
          milesAway: explore_location.miles_away || 0,
          //locationId: explore_location.location_id || 0,
          latitude: explore_location.latitude || 0,
          longitude: explore_location.longitude || 0,
          tags: explore_location.tags || {},
          windCompass: explore_location.wind_compass || "",
          windAgreementScore: explore_location.wind_agreement_score || 0,
          windHarmony: explore_location.wind_harmony || false,
          streetViewImage: explore_location.street_view_image || "",
        };
        setPortalSurroundings(portalSurroundingsData);
        setRuinsSurroundings(ruinsSurroundingsData);
        setHomeSurroundings(homeSurroundingsData); 

        setLocationId(explore_location.id);
        setIsExploring(!!explore_location.id);
      }
     
    } else {
      // Reset both data objects if currentSurroundings is null or undefined
      portalSurroundingsData = {
        name: "N/A",
        id: null,
        lastAccessed: "", 
        temperature: 0,
        description: "",
        windSpeed: 0,
        windDirection: 0,
        humidity: 0,
        pressure: 0,
        cloudiness: 0,
        sunriseTimestamp: 0,
        sunsetTimestamp: 0,
        latitude: 0,
        longitude: 0,
        windFriends: "",
        specialHarmony: false,
        details: "",
        experience: "",
        windSpeedInteraction: "",
        pressureInteraction: "",
        humidityInteraction: "",
        strongerWindInteraction: "",
        expired: false,
      };

      homeSurroundingsData = {
        name: "",
        id: null,
        //created_on: '',
        lastAccessed: "",
        temperature: 0,
        description: "",
        windSpeed: 0,
        windDirection: 0,
        humidity: 0,
        pressure: 0,
        cloudiness: 0,
        sunriseTimestamp: 0,
        sunsetTimestamp: 0,
        latitude: 0,
        longitude: 0,
      };

      ruinsSurroundingsData = {
        name: "",
        id: null, 
        directionDegree: 0,
        direction: "",
        milesAway: 0,
        //locationId: 0,
        latitude: 0,
        longitude: 0,
        tags: {},
        windCompass: "",
        windAgreementScore: 0,
        windHarmony: false,
        streetViewImage: "",
      };

      setPortalSurroundings(portalSurroundingsData);
      setRuinsSurroundings(ruinsSurroundingsData);
      setHomeSurroundings(homeSurroundingsData); 

      setLocationId(null);
      setLastAccessed(null); 
      if (!wasPrevExploring) {
        setIsExploring(false);
      } else {
        setWasPrevExploring(false); //reset; will get toggled again if picking new location. this is here bc frontend pings endpoint faster than backend is ready with new loc, I THINK
      }
      
    }


    setIsInitializingLocation(false);
    
  }, [currentSurroundings]); 

  const handlePickNewSurroundings = async (data: any) => { 
    let locationType;
    if (data && data.explore_type) {
      console.log(data);
      try {
        locationType = data.explore_type === 'discovery_location' ? 'explore_location' : 'twin_location';
        await pickNewSurroundingsMutation.mutateAsync({ [locationType]: data.id });
        // Optionally set loading state or other state as needed
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  };
  const pickNewSurroundingsMutation = useMutation({
    mutationFn: (locationData: { [key: string]: number }) => pickNewSurroundings(locationData),
    onMutate: () => {
      setWasPrevExploring(true);
      setIsInitializingLocation(true); 
      setLocationId(null);
      setLastAccessed(null);

    },
    onSuccess: (data) => {
      // setLocationId(null);
      // setLastAccessed(null);
      logGroqState();
      extendGroqStaleTime(); // reset staleTime for portal location history script
      logGroqState();
      const isOnNearbyScreen = segments[2] === "nearby"; 
      if (isOnNearbyScreen) {
        
      router.replace("(drawer)/(exploretabs)");
      
    }
     // triggerRefetch(); //active state + websocket
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        pickNewSurroundingsMutation.reset();
      }, 2000);
    },
  });
 

  const triggerSurroundingsRefetch = () => {
    console.log("Triiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiggering explore locationrefetch");
    queryClient.invalidateQueries({ queryKey: ["currentSurroundings", lastLocationId, lastState] });
    queryClient.refetchQueries({ queryKey: ["currentSurroundings", lastLocationId, lastState] }); // Force refetch
  }; 

  return (
    <CurrentSurroundingsContext.Provider
      value={{
        currentSurroundings,
        locationId,
        isExploring,
        portalSurroundings,
        homeSurroundings,
        ruinsSurroundings,
        lastAccessed, 
        handlePickNewSurroundings,
        pickNewSurroundingsMutation,
        triggerSurroundingsRefetch,
        isInitializingLocation,
      }}
    >
      {children}
    </CurrentSurroundingsContext.Provider>
  );
};
