import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useUser } from "./UserContext";  
import { useSurroundingsWS } from "./SurroundingsWSContext";  
import { useGroqContext } from "./GroqContext";  
import { useActiveSearch } from "./ActiveSearchContext";
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";

import { getExploreLocation, pickNewSurroundings } from "../calls/apicalls";

// TYPES

import {
  CurrentSurroundings,
  PortalSurroundings,
  RuinsSurroundings,
  HomeSurroundings,
  RawTwinLocation,
  RawHomeLocation,
  RawRuinsLocation,
} from "../types/CurrentSurroundingsContextTypes";

type SurroundingData = {
  explore_type: string;
  id: any;
};

interface CurrentSurroundingsContextType {
  currentSurroundings: CurrentSurroundings | null | undefined;
  locationId: number | null; 
  portalSurroundings: PortalSurroundings | null; // Assuming this is the transformed type
  homeSurroundings: HomeSurroundings | null; // Use the transformed HomeLocation type
  ruinsSurroundings: RuinsSurroundings | null;
  lastAccessed: string | null; // Or the appropriate type for lastAccessed
  handlePickNewSurroundings: (data: SurroundingData) => Promise<void>;
  pickNewSurroundingsMutation: UseMutationResult<
    any,
    Error,
    { [key: string]: number },
    void
  >;
  triggerSurroundingsRefetch: () => void;
  currentSurroundingsIsPending: boolean; 
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
  const { refetchRemainingGoes } = useActiveSearch();
  const { extendGroqStaleTime, logGroqState } = useGroqContext();
  const segments = useSegments();
  const queryClient = useQueryClient();
  const { lastState, lastLocationId, lastLocationIsSame } = useSurroundingsWS();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [portalSurroundings, setPortalSurroundings] =
    useState<PortalSurroundings | null>(null);
  const [ruinsSurroundings, setRuinsSurroundings] =
    useState<RuinsSurroundings | null>(null);
  const [homeSurroundings, setHomeSurroundings] =
    useState<HomeSurroundings | null>(null);

  const [locationId, setLocationId] = useState<number | null>(null);
  const [lastAccessed, setLastAccessed] = useState<string | null>(null);  
 

  const router = useRouter();

  const {
    data: currentSurroundings,
    isLoading,
    isFetching,
    isPending: currentSurroundingsIsPending, //isPending is what works, isLoading and isFetching don't do anything in the useEffect
    isError,
    error,
    isSuccess,
  } = useQuery<CurrentSurroundings | null>({
    queryKey: ["currentSurroundings", lastLocationId, user?.id],
    queryFn: getExploreLocation,

    enabled:
      !!isAuthenticated &&
      !isInitializing &&
      !!lastLocationId &&
      lastState !== "home" &&
      lastState !== "searching for twin" &&
      lastLocationIsSame !== "yes",
    // staleTime: 0,
  });
 

  // Invalidate remaining goes cache when location is fetched
  // need to improve so that doesn't just fetch same data over and over
 useEffect(() => {
  if (isSuccess) {
    refetchRemainingGoes();
  }

 }, [isSuccess]);


  const handlePickNewSurroundings = async (data: any) => {
    let locationType;
    if (data && data.explore_type) {
      console.log(data);
      try {
        locationType =
          data.explore_type === "discovery_location"
            ? "explore_location"
            : "twin_location";
        await pickNewSurroundingsMutation.mutateAsync({
          [locationType]: data.id,
        });
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  };
  const pickNewSurroundingsMutation = useMutation({
    mutationFn: (locationData: { [key: string]: number }) =>
      pickNewSurroundings(locationData),
    onMutate: () => {  
      setLocationId(null);
      setLastAccessed(null);
    },
    onSuccess: () => {
      logGroqState();
      extendGroqStaleTime(); // reset staleTime for portal location history script
      logGroqState();
      const isOnNearbyScreen = segments[2] === "nearby";
      if (isOnNearbyScreen) {
        //router.replace("(drawer)/(exploretabs)");  // TS complained
        router.replace("/(exploretabs)");
      }
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
    queryClient.invalidateQueries({
      queryKey: ["currentSurroundings", lastLocationId, user?.id],
    });
    queryClient.refetchQueries({
      queryKey: ["currentSurroundings", lastLocationId, user?.id],
    });  
  };

  return (
    <CurrentSurroundingsContext.Provider
      value={{
        currentSurroundings,
        locationId, 
        portalSurroundings,
        homeSurroundings,
        ruinsSurroundings,
        lastAccessed,
        handlePickNewSurroundings,
        pickNewSurroundingsMutation,
        triggerSurroundingsRefetch, 
        currentSurroundingsIsPending,
      }}
    >
      {children}
    </CurrentSurroundingsContext.Provider>
  );
};
