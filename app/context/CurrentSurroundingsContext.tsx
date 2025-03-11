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
import { getExploreLocation, pickNewSurroundings, getRemainingGoes } from "../apicalls";
import useExploreRoute from "../hooks/useExploreRoute";
import { useActiveSearch } from "./ActiveSearchContext"; 
import { useSurroundingsWS } from "./SurroundingsWSContext";
 
 
interface CurrentSurroundings {
  id: number;
  explore_location?: RuinsSurroundings; // Use RuinsLocation for explore_location
  twin_location?: PortalSurroundings; // Use PortalLocation for twin_location
  user: number;
  last_accessed: string;
  expired: boolean;  
}

 

interface PortalSurroundings {
  name: string;
  id: number;
  lastAccessed: string;

  temperature: number;
  description: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  cloudiness: number;
  sunriseTimestamp: number;
  sunsetTimestamp: number;
  latitude: number;
  longitude: number;
  windFriends: string;
  specialHarmony: boolean;
  details: string;
  experience: string;
  windSpeedInteraction: string;
  pressureInteraction: string;
  humidityInteraction: string;
  strongerWindInteraction: string;
  expired: boolean;
}

interface HomeSurroundings {
  name: string;
  id: number;
  //created_on: string;
  last_accessed: string;
  temperature: number;
  description: string;
  wind_speed: number;
  wind_direction: number;
  humidity: number;
  pressure: number;
  cloudiness: number;
  sunrise_timestamp: number;
  sunset_timestamp: number;
  latitude: number;
  longitude: number;
}

interface RuinsSurroundings {
  name: string;
  id: number;

  directionDegree: number;
  direction: string;
  milesAway: number;
  //locationId: number; 
  latitude: number;
  longitude: number;
  tags: Record<string, string>;
  windCompass: string;
  windAgreementScore: number;
  windHarmony: boolean;
  streetViewImage: string;
}

interface CurrentSurroundingsContextType {
  currentSurroundings: CurrentSurroundings | null;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurrentSurroundingsContext = createContext<
  CurrentSurroundingsContextType | undefined
>(undefined);

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

export const CurrentSurroundingsProvider: React.FC<
  CurrentSurroundingsProviderProps
> = ({ children }) => {
  
  const { user, isAuthenticated, isInitializing } = useUser();
  const segments = useSegments();
  const queryClient = useQueryClient();
  const { lastLocationName, lastLocationId } = useSurroundingsWS();
  const timeoutRef = useRef(null);
  const { manualSurroundingsRefresh, resetRefreshSurroundingsManually } =
    useActiveSearch();
  const [portalSurroundings, setPortalSurroundings] =
    useState<PortalSurroundings | null>(null);
  const [ruinsSurroundings, setRuinsSurroundings] =
    useState<RuinsSurroundings | null>(null);
  const [homeSurroundings, setHomeSurroundings] =
    useState<HomeSurroundings | null>(null);

    const [locationId, setLocationId] = useState<number | null>(null);
    
    const [lastAccessed, setLastAccessed] = useState<number | null>(null);
    const [isExploring, setIsExploring] = useState<boolean>(false);
    const [wasPrevExploring, setWasPrevExploring] = useState<boolean>(false);
    const [isInitializingLocation, setIsInitializingLocation] = useState<boolean>(true);

    const router = useRouter();

 

  const {
    data: currentSurroundings,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery<CurrentSurroundings | null>({
    queryKey: ["currentSurroundings", lastLocationId],
    queryFn: getExploreLocation,
    enabled: !!isAuthenticated && !isInitializing,
   staleTime: 0,
    onError: (err) => {
      console.error("Error fetching location data:", err);
    },
    onSuccess: (data) => {
      if (data) {
      }
    },
  });
  useEffect(() => {
    if (isFetching) {
      if (!setIsInitializingLocation) {
      
      setIsInitializingLocation(true);
      
    }
      console.log('SETTING INITIALIZING LOCATINOOOO');
    }
  }, [isFetching]);

useEffect(() => {
  if (!isAuthenticated) {
    queryClient.removeQueries(["currentSurroundings", lastLocationId]);
    setPortalSurroundings(null);
    setRuinsSurroundings(null);
    setHomeSurroundings(null);
    setLocationId(null);
    setLastAccessed(null);
    setIsExploring(false);
    setWasPrevExploring(false);
  }
}, [isAuthenticated]);


// useExploreRoute(isExploring, isInitializingLocation, isAuthenticated);


useEffect(() => {
  console.log('surroundings reset use effect triggered');
  if (manualSurroundingsRefresh) { 
    console.log('manualSurroundingsRefresh triggered currentSurroundings to refetch');
    triggerSurroundingsRefetch();

    const timeout = setTimeout(() => {
      resetRefreshSurroundingsManually();
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timeout); // Cleanup in case of re-renders
  }
}, [manualSurroundingsRefresh]);


  useEffect(() => {
    console.log('main initializer use effect in surroundings triggered');
  
    //setIsInitializingLocation(true); moved this to a useEffect that tracks isFetching
    let portalSurroundingsData: PortalSurroundings | null = null;
    let ruinsSurroundingsData: RuinsSurroundings | null = null;
    let homeSurroundingsData: HomeSurroundings | null = null;

    // I don't think this is working
    // if (currentSurroundings?.expired === true) {
    //   setPortalSurroundings(null);
    //   setRuinsSurroundings(null);
    //   setHomeSurroundings(null);
    //   setLocationId(null);
    //   setLastAccessed(null);
    //   setIsExploring(false);
    // }

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
          description: twin_location.description || "", // fill in
          windSpeed: twin_location.wind_speed || 0, // fill in
          windDirection: twin_location.wind_direction || 0, // fill in
          humidity: twin_location.humidity || 0, // fill in
          pressure: twin_location.pressure || 0, // fill in
          cloudiness: twin_location.cloudiness || 0, // fill in
          sunriseTimestamp: twin_location.sunrise_timestamp || 0, // fill in
          sunsetTimestamp: twin_location.sunset_timestamp || 0, // fill in
          latitude: twin_location.latitude || 0, // fill in
          longitude: twin_location.longitude || 0, // fill in
          windFriends: twin_location.wind_friends || "", // fill in
          specialHarmony: twin_location.special_harmony || false, // fill in
          details: twin_location.details || "", // fill in
          experience: twin_location.experience || "", // fill in
          windSpeedInteraction: twin_location.wind_speed_interaction || "", // fill in
          pressureInteraction: twin_location.pressure_interaction || "", // fill in
          humidityInteraction: twin_location.humidity_interaction || "", // fill in
          strongerWindInteraction:
            twin_location.stronger_wind_interaction || "", // fill in
          expired: twin_location.expired || false, // fill in
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
          id: origin_location.id, // fill in
          lastAccessed: origin_location.last_accessed || "", // fill in
          temperature: origin_location.temperature || 0, // fill in
          description: origin_location.description || "", // fill in
          windSpeed: origin_location.wind_speed || 0, // fill in
          windDirection: origin_location.wind_direction || 0, // fill in
          humidity: origin_location.humidity || 0, // fill in
          pressure: origin_location.pressure || 0, // fill in
          cloudiness: origin_location.cloudiness || 0, // fill in
          sunriseTimestamp: origin_location.sunrise_timestamp || 0, // fill in
          sunsetTimestamp: origin_location.sunset_timestamp || 0, // fill in
          latitude: origin_location.latitude || 0, // fill in
          longitude: origin_location.longitude || 0, // fill in
          windFriends: origin_location.wind_friends || "", // fill in
          specialHarmony: origin_location.special_harmony || false, // fill in
          details: origin_location.details || "", // fill in
          experience: origin_location.experience || "", // fill in
          windSpeedInteraction: origin_location.wind_speed_interaction || "", // fill in
          pressureInteraction: origin_location.pressure_interaction || "", // fill in
          humidityInteraction: origin_location.humidity_interaction || "", // fill in
          strongerWindInteraction:
            origin_location.stronger_wind_interaction || "", // fill in
          expired: origin_location.expired || false, // fill in
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
      console.log('RESETTING IS EXPLORING TO FALSE');
      if (!wasPrevExploring) {
        setIsExploring(false);
      } else {
        setWasPrevExploring(false); //reset; will get toggled again if picking new location. this is here bc frontend pings endpoint faster than backend is ready with new loc, I THINK
      }
     
      console.log('no surroundings found in main initializer use effect in surroundings');
    }


    setIsInitializingLocation(false);
  }, [currentSurroundings]); 

  const handlePickNewSurroundings = async (data) => { 
   

    let locationType;
    if (data && data.explore_type) {
      console.log(data);
      try {
        locationType = data.explore_type === 'discovery_location' ? 'explore_location' : 'twin_location';
        await pickNewSurroundingsMutation.mutateAsync({[locationType]: data.id });
        //setIsInitializingLocation(true);
       // setLastAccessed(null);
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  }; 

  const pickNewSurroundingsMutation = useMutation({
    mutationFn: (locationData) => pickNewSurroundings(locationData),
    onMutate: () => {
      setWasPrevExploring(true);
      setIsInitializingLocation(true); 
      setLocationId(null);
      setLastAccessed(null);

    },
    onSuccess: (data) => {
      // setLocationId(null);
      // setLastAccessed(null);
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
    console.log("Triggering explore locationrefetch");
    queryClient.invalidateQueries({ queryKey: ["currentSurroundings", lastLocationId] });
  // queryClient.removeQueries(["currentSurroundings"]);
    queryClient.refetchQueries({ queryKey: ["currentSurroundings", lastLocationId] }); // Force refetch
  };

    // const {
    //   data: remainingGoes,
      
    // } = useQuery({
    //   queryKey: ["remainingGoes"],
    //   queryFn: () => getRemainingGoes(),
    //   enabled: !!isAuthenticated && !isInitializing,
    //   onSuccess: (data) => {},
    // });
  
    // const refetchRemainingGoes = () => {
    //   queryClient.invalidateQueries({ queryKey: ["remainingGoes"] });
    //   queryClient.refetchQueries({ queryKey: ["remainingGoes"] });
    // };
  

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
        //remainingGoes, considerin moving this here, it is in ActiveSearchContext right now
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
