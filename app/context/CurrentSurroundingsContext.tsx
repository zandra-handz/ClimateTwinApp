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
import { getExploreLocation, pickNewSurroundings } from "../apicalls";

import { useActiveSearch } from "./ActiveSearchContext";

import { useNearbyLocations } from "./NearbyLocationsContext";

// Define your interfaces for `currentSurroundings`
interface CurrentSurroundings {
  id: number;
  explore_location?: RuinsSurroundings; // Use RuinsLocation for explore_location
  twin_location?: PortalSurroundings; // Use PortalLocation for twin_location
  user: number;
  last_accessed: string;
  expired: boolean;
  // Other fields depending on the structure
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
  locationId: number; // you can keep this or remove it if unnecessary
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
  const { user, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);
  const { manualSurroundingsRefresh, resetRefreshSurroundingsManually } =
    useActiveSearch();
  const [portalSurroundings, setPortalSurroundings] =
    useState<PortalSurroundings | null>(null);
  const [ruinsSurroundings, setRuinsSurroundings] =
    useState<RuinsSurroundings | null>(null);
  const [homeSurroundings, setHomeSurroundings] =
    useState<HomeSurroundings | null>(null);

  const {
    data: currentSurroundings,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<CurrentSurroundings | null>({
    queryKey: ["currentSurroundings"],
    queryFn: getExploreLocation,
    enabled: !!isAuthenticated,
    onError: (err) => {
      console.error("Error fetching location data:", err);
    },
    onSuccess: (data) => {
      if (data) {
      }
    },
  });


useEffect(() => {
  if (!isAuthenticated) {
    queryClient.removeQueries(["currentSurroundings"]);
    setPortalSurroundings(null);
    setRuinsSurroundings(null);
    setHomeSurroundings(null);
  }
}, [isAuthenticated, queryClient]);

  useEffect(() => {
    if (manualSurroundingsRefresh) {
      // console.log("CURRENT SURROUNDINGS REFETCH TRIGGERED");
      triggerRefetch();
      resetRefreshSurroundingsManually();
    }
  }, [manualSurroundingsRefresh]);

  useEffect(() => {
    let portalSurroundingsData: PortalSurroundings | null = null;
    let ruinsSurroundingsData: RuinsSurroundings | null = null;
    let homeSurroundingsData: HomeSurroundings | null = null;

    // I don't think this is working
    if (currentSurroundings?.expired === true) {
      setPortalSurroundings(null);
      setRuinsSurroundings(null);
      setHomeSurroundings(null);
    }

    if (currentSurroundings) {
      // console.log('CURRENT SURROUNDINGS', currentSurroundings);
      const { twin_location, explore_location } = currentSurroundings;

      if (twin_location) {
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
          last_accessed: home_location.last_accessed || "",
          temperature: home_location.temperature || 0,
          description: home_location.description || "",
          wind_speed: home_location.wind_speed || 0,
          wind_direction: home_location.wind_direction || 0,
          humidity: home_location.humidity || 0,
          pressure: home_location.pressure || 0,
          cloudiness: home_location.cloudiness || 0,
          sunrise_timestamp: home_location.sunrise_timestamp || 0,
          sunset_timestamp: home_location.sunset_timestamp || 0,
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
      } else if (explore_location) {
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
          last_accessed: home_location.last_accessed || "",
          temperature: home_location.temperature || 0,
          description: home_location.description || "",
          wind_speed: home_location.wind_speed || 0,
          wind_direction: home_location.wind_direction || 0,
          humidity: home_location.humidity || 0,
          pressure: home_location.pressure || 0,
          cloudiness: home_location.cloudiness || 0,
          sunrise_timestamp: home_location.sunrise_timestamp || 0,
          sunset_timestamp: home_location.sunset_timestamp || 0,
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
        last_accessed: "",
        temperature: 0,
        description: "",
        wind_speed: 0,
        wind_direction: 0,
        humidity: 0,
        pressure: 0,
        cloudiness: 0,
        sunrise_timestamp: 0,
        sunset_timestamp: 0,
        latitude: 0,
        longitude: 0,
      };

      ruinsSurroundingsData = {
        name: "",
        id: null,

        directionDegree: 0,
        direction: "",
        milesAway: 0,
        locationId: 0,
        latitude: 0,
        longitude: 0,
        tags: {},
        windCompass: "",
        windAgreementScore: 0,
        windHarmony: false,
        streetViewImage: "",
      };
    }

    setPortalSurroundings(portalSurroundingsData);
    setRuinsSurroundings(ruinsSurroundingsData);
    setHomeSurroundings(homeSurroundingsData);

    // console.log('USE EFFECT IN CONTEXT: ', currentSurroundings);
    // console.log('PortalLocation Data: ', portalLocationData);
    // console.log('RuinsLocation Data: ', ruinsLocationData);
  }, [currentSurroundings]);

  // useEffect(() => {
  //   if (portalSurroundings) {
  //     console.log(
  //       `Portal location!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: `,
  //       portalSurroundings
  //     );
  //   }
  // }, [portalSurroundings]);

  // useEffect(() => {
  //   if (ruinsSurroundings) {
  //     console.log(
  //       `Ruins location!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: `,
  //       ruinsSurroundings
  //     );
  //   }
  // }, [ruinsSurroundings]);

  // useEffect(() => {
  //   if (homeSurroundings) {
  //     console.log(
  //       `Home location!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: `,
  //       homeSurroundings
  //     );
  //   }
  // }, [homeSurroundings]);

  // const handleExploreLocation = (data) => {
  //   console.log('handle explore location pressed!', data);

  //   if (data && data.explore_type) {
  //     const locationType = data.explore_type === 'discovery_location' ? 'explore_location' : 'twin_location';
  // //MOVE TO HOOK AND USE A MUTATION TO TRIGGER THE REFRESH
  //     exploreLocation({ [locationType]: data.id });
  //     //refreshSurroundingsManually();
  //   }
  // };

  const handlePickNewSurroundings = async (data) => {
    //console.log('Updating location:', locationId, locationUpdate);
    let locationType;
    if (data && data.explore_type) {
      try {
        locationType = data.explore_type === 'discovery_location' ? 'explore_location' : 'twin_location';
        await pickNewSurroundingsMutation.mutateAsync({[locationType]: data.id });
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  };

  // console.log("onSuccess called:", isSuccess);

  const pickNewSurroundingsMutation = useMutation({
    mutationFn: (locationData) => pickNewSurroundings(locationData),
    onSuccess: (data) => {
      triggerRefetch();
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

  const triggerRefetch = () => {
   // console.log("Triggering immediate refetch");
    queryClient.invalidateQueries({ queryKey: ["currentSurroundings"] });
    queryClient.refetchQueries({ queryKey: ["currentSurroundings"] }); // Force refetch
  };

  return (
    <CurrentSurroundingsContext.Provider
      value={{
        currentSurroundings,
        portalSurroundings,
        homeSurroundings,
        ruinsSurroundings,
        handlePickNewSurroundings,
        triggerRefetch,
      }}
    >
      {children}
    </CurrentSurroundingsContext.Provider>
  );
};
