import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getExploreLocation, pickNewSurroundings } from '../apicalls';

import { useActiveSearch } from './ActiveSearchContext';
 
import { useNearbyLocations } from './NearbyLocationsContext';  

interface CurrentSurroundings { //commented out is the data we get from the original matched location
  //cloudiness: number;
  created_on: string;
  // description: string;
  // details: string;
  // experience: string;
  // explore_type: string;
  // home_location: number;
  // humidity: number;
  // humidity_interaction: string;
  id: number;
  explore_location: number;
  last_accessed: string;
  twin_location: number;
  // latitude: number;
  // longitude: number;
  // name: string;
  // pressure: number;
  // pressure_interaction: string;
  // special_harmony: boolean;
  // stronger_wind_interaction: string;
  // sunrise_timestamp: number;
  // sunset_timestamp: number;
  // temperature: number;
  user: number;
  // wind_direction: number;
  // wind_friends: string;
  // wind_speed: number;
  // wind_speed_interaction: string;



  // (NOBRIDGE) LOG  handle explore location pressed! {"cloudiness": 1, "created_on": "2025-02-06T00:01:23.731950Z", "description": "clear sky", "details": "Slantwise winds could contribute to variable weather patterns with scattered precipitation.", "experience": "Wind is from the left, which may result in variable weather patterns.", "explore_type": "twin_location", "home_location": 1441, "humidity": 62, "humidity_interaction": "Match", "id": 1477, "last_accessed": "2025-02-06T00:01:23.731976Z", "latitude": 47.7231589959676, "longitude": 14.139293334559785, "name": "Hinterstoder, Austria", "pressure": 1040, "pressure_interaction": "High atmospheric pressure may contribute to stable and clear weather conditions.", "special_harmony": false, "stronger_wind_interaction": "yours", "sunrise_timestamp": 1738823014, "sunset_timestamp": 1738858291, "temperature": 18.64, "user": 1, "wind_direction": 148, "wind_friends": "Slantwise", "wind_speed": 1.34, "wind_speed_interaction": "Wind has a mild effect on your wind, contributing to a gentle breeze."}   
  // (NOBRIDGE) LOG  {"twin_location": 1477}
}


interface PortalLocation {
  id: number;
  lastAccessed: string;
  name: string;
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


interface RuinsLocation {
  id: number;
  name: string;
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

const CurrentSurroundingsContext = createContext<CurrentSurroundingsContextType | undefined>(undefined);

export const useSurroundings = (): CurrentSurroundingsContextType => {
  const context = useContext(CurrentSurroundingsContext);
  if (!context) {
    throw new Error('useSurroundings must be used within a CurrentSurroundingsProvider');
  }
  return context;
};

interface CurrentSurroundingsProviderProps {
  children: ReactNode;
}




export const CurrentSurroundingsProvider: React.FC<CurrentSurroundingsProviderProps> = ({ children }) => {
  const { user } = useUser(); 
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);
  const { manualSurroundingsRefresh, resetRefreshSurroundingsManually  } = useActiveSearch();
const [portalLocation, setPortalLocation ] = useState({});
const [ruinsLocation, setRuinsLocation ] = useState({});

  const { data: currentSurroundings, isLoading, isError, isSuccess } = useQuery<CurrentSurroundings | null>({
    queryKey: ['currentSurroundings'],
    queryFn: getExploreLocation,
    enabled: !!user && !!user.authenticated,
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
    onSuccess: (data) => { 
      console.log('onSuccess data:', data);  
      if (data) {
       console.log('getExploreLocation (currentSurroundings) success:', data);




        if (data.twin_location) {
          console.log('TWIN LOCATION!')
        }

        if (data.explore_location) {
          console.log('EXPLORE LOCATION!')
        }

 
        // Data is already in the correct structure, no mapping needed here
      }
    },
  });




  useEffect(() => {
    if (manualSurroundingsRefresh) {
      console.log('CURRENT SURROUNDINGS REFETCH TRIGGERED');
      triggerRefetch();
      resetRefreshSurroundingsManually();

    }

  }, [manualSurroundingsRefresh]);
 

  useEffect(() => {
    let portalLocationData: PortalLocation | null = null;
    let ruinsLocationData: RuinsLocation | null = null;
  
    if (currentSurroundings) {
      if (currentSurroundings.twin_location) {
        // Fields for PortalLocation if twin_location is present
        portalLocationData = {
          id: currentSurroundings.twin_location.id,  // fill in
          lastAccessed: currentSurroundings.twin_location.last_accessed || "",  // fill in
          name: currentSurroundings.twin_location.name || 'N/A',  // fill in
          temperature: currentSurroundings.twin_location.temperature || 0,  // fill in
          description: currentSurroundings.twin_location.description || "",  // fill in
          windSpeed: currentSurroundings.twin_location.wind_speed || 0,  // fill in
          windDirection: currentSurroundings.twin_location.wind_direction || 0,  // fill in
          humidity: currentSurroundings.twin_location.humidity || 0,  // fill in
          pressure: currentSurroundings.twin_location.pressure || 0,  // fill in
          cloudiness: currentSurroundings.twin_location.cloudiness || 0,  // fill in
          sunriseTimestamp: currentSurroundings.twin_location.sunrise_timestamp || 0,  // fill in
          sunsetTimestamp: currentSurroundings.twin_location.sunset_timestamp || 0,  // fill in
          latitude: currentSurroundings.twin_location.latitude || 0,  // fill in
          longitude: currentSurroundings.twin_location.longitude || 0,  // fill in
          windFriends: currentSurroundings.twin_location.wind_friends || "",  // fill in
          specialHarmony: currentSurroundings.twin_location.special_harmony || false,  // fill in
          details: currentSurroundings.twin_location.details || "",  // fill in
          experience: currentSurroundings.twin_location.experience || "",  // fill in
          windSpeedInteraction: currentSurroundings.twin_location.wind_speed_interaction || "",  // fill in
          pressureInteraction: currentSurroundings.twin_location.pressure_interaction || "",  // fill in
          humidityInteraction: currentSurroundings.twin_location.humidity_interaction || "",  // fill in
          strongerWindInteraction: currentSurroundings.twin_location.stronger_wind_interaction || "",  // fill in
          expired: currentSurroundings.twin_location.expired || false,  // fill in
        };
  
        // Fields for RuinsLocation if twin_location is present (can leave null if not used)
        ruinsLocationData = {
          id: 0,
          name: "",
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
  
      } else if (currentSurroundings.explore_location) {
        // Fields for PortalLocation if explore_location is present (can leave null if not used)
        portalLocationData = {
          id: currentSurroundings.explore_location.origin_location.id,  // fill in
          lastAccessed: currentSurroundings.explore_location.origin_location.last_accessed || "",  // fill in
          name: currentSurroundings.explore_location.origin_location.name || 'N/A',  // fill in
          temperature: currentSurroundings.explore_location.origin_location.temperature || 0,  // fill in
          description: currentSurroundings.explore_location.origin_location.description || "",  // fill in
          windSpeed: currentSurroundings.explore_location.origin_location.wind_speed || 0,  // fill in
          windDirection: currentSurroundings.explore_location.origin_location.wind_direction || 0,  // fill in
          humidity: currentSurroundings.explore_location.origin_location.humidity || 0,  // fill in
          pressure: currentSurroundings.explore_location.origin_location.pressure || 0,  // fill in
          cloudiness: currentSurroundings.explore_location.origin_location.cloudiness || 0,  // fill in
          sunriseTimestamp: currentSurroundings.explore_location.origin_location.sunrise_timestamp || 0,  // fill in
          sunsetTimestamp: currentSurroundings.explore_location.origin_location.sunset_timestamp || 0,  // fill in
          latitude: currentSurroundings.explore_location.origin_location.latitude || 0,  // fill in
          longitude: currentSurroundings.explore_location.origin_location.longitude || 0,  // fill in
          windFriends: currentSurroundings.explore_location.origin_location.wind_friends || "",  // fill in
          specialHarmony: currentSurroundings.explore_location.origin_location.special_harmony || false,  // fill in
          details: currentSurroundings.explore_location.origin_location.details || "",  // fill in
          experience: currentSurroundings.explore_location.origin_location.experience || "",  // fill in
          windSpeedInteraction: currentSurroundings.explore_location.origin_location.wind_speed_interaction || "",  // fill in
          pressureInteraction: currentSurroundings.explore_location.origin_location.pressure_interaction || "",  // fill in
          humidityInteraction: currentSurroundings.explore_location.origin_location.humidity_interaction || "",  // fill in
          strongerWindInteraction: currentSurroundings.explore_location.origin_location.stronger_wind_interaction || "",  // fill in
          expired: currentSurroundings.explore_location.origin_location.expired || false,  // fill in
        };
  
        // Fields for RuinsLocation if explore_location is present
        ruinsLocationData = {
          id: currentSurroundings.explore_location.id || 0,
          name: currentSurroundings.explore_location.name || "",
          directionDegree: currentSurroundings.explore_location.direction_degree || 0,
          direction: currentSurroundings.explore_location.direction || "",
          milesAway: currentSurroundings.explore_location.miles_away || 0,
          locationId: currentSurroundings.explore_location.location_id || 0,
          latitude: currentSurroundings.explore_location.latitude || 0,
          longitude: currentSurroundings.explore_location.longitude || 0,
          tags: currentSurroundings.explore_location.tags || {},
          windCompass: currentSurroundings.explore_location.wind_compass || "",
          windAgreementScore: currentSurroundings.explore_location.wind_agreement_score || 0,
          windHarmony: currentSurroundings.explore_location.wind_harmony || false,
          streetViewImage: currentSurroundings.explore_location.street_view_image || "",
        };
        
      }
    } else {
      // Reset both data objects if currentSurroundings is null or undefined
      portalLocationData = {
        id: 0,
        lastAccessed: "",
        name: "N/A",
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
  
      ruinsLocationData = {
        id: 0,
        name: "",
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
  
    setPortalLocation(portalLocationData);
    setRuinsLocation(ruinsLocationData);
  
    console.log('USE EFFECT IN CONTEXT: ', currentSurroundings);
    console.log('PortalLocation Data: ', portalLocationData);
    console.log('RuinsLocation Data: ', ruinsLocationData);
  }, [currentSurroundings]);
  


  useEffect(() => {
    if (portalLocation) {
      console.log(`Portal location!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: `, portalLocation);
    }

  },[portalLocation]);


  useEffect(() => {
    if (ruinsLocation) {
      console.log(`Ruins location!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: `, ruinsLocation);
    }

  },[ruinsLocation]);
  
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

  console.log('onSuccess called:', isSuccess);

  const pickNewSurroundingsMutation = useMutation({
    mutationFn: ( locationData ) => pickNewSurroundings(locationData),
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
    console.log('Triggering immediate refetch');
    queryClient.invalidateQueries({ queryKey: ['currentSurroundings'] });
    queryClient.refetchQueries({ queryKey: ['currentSurroundings'] }); // Force refetch
  };
  
  

  return (
    <CurrentSurroundingsContext.Provider value={{ currentSurroundings, portalLocation, ruinsLocation, handlePickNewSurroundings, triggerRefetch }}>
      {children}
    </CurrentSurroundingsContext.Provider>
  );
};
