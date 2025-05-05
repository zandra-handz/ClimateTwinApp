import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "./UserContext";
import { useUserSettings } from "./UserSettingsContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNearbyLocations } from "../calls/apicalls";
import { useSurroundingsWS } from "./SurroundingsWSContext";

interface NearbyLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  explore_type: string;
  created_on: string;
  last_accessed: string;
  miles_away?: number;
  wind_agreement_score?: number;
  wind_compass?: string;
  tags?: Record<string, string>;
}

interface NearbyLocationsContextType {
  nearbyLocations: NearbyLocation[] | undefined;
 
}

const NearbyLocationsContext = createContext<
  NearbyLocationsContextType | undefined
>(undefined);

export const useNearbyLocations = (): NearbyLocationsContextType => {
  const context = useContext(NearbyLocationsContext);
  if (!context) {
    throw new Error(
      "useNearbyLocations must be used within a NearbyLocationsProvider"
    );
  }
  return context;
};

interface NearbyLocationsProviderProps {
  children: ReactNode;
}

export const NearbyLocationsProvider: React.FC<
  NearbyLocationsProviderProps
> = ({ children }) => {
  const { user, isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { lastState, lastLocationId, baseLocationId } = useSurroundingsWS();
  // const [centeredNearbyLocations, setCenteredNearbyLocations] = useState<
  //   NearbyLocation[]
  // >([]);

  const queryClient = useQueryClient();

  // isPortal === 'yes' is not right

  const {
    data: nearbyLocations,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<NearbyLocation[]>({
    queryKey: ["nearbyLocations", baseLocationId, user?.id],
    queryFn: getNearbyLocations,
    enabled:
      !!isAuthenticated &&
      !settingsAreLoading &&
      !!lastLocationId &&
      lastState === "exploring",
    //staleTime: 0,
  });
 
  

  return (
    <NearbyLocationsContext.Provider
      value={{ nearbyLocations }}
    >
      {children}
    </NearbyLocationsContext.Provider>
  );
};
