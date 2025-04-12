import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { useUser } from "./UserContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItemChoices } from "../calls/apicalls";
import { useSurroundings } from "./CurrentSurroundingsContext";
import { useSurroundingsWS } from "./SurroundingsWSContext";

interface LocationDetails {
  id: number | null;
  name: string | null;
  created_on: string | null;
  last_accessed: string | null;
  latitude: string | null;
  longitude: string | null;
  user: string | null;
}

interface TwinLocationDetails extends LocationDetails {
  cloudiness: string | null;
  description: string | null;
  details: string | null;
  experience: string | null;
  explore_type: string | null;
  home_location: string | null;
  humidity: string | null;
  humidity_interaction: string | null;
  pressure: string | null;
  pressure_interaction: string | null;
  special_harmony: string | null;
  stronger_wind_interaction: string | null;
  sunrise_timestamp: string | null;
  sunset_timestamp: string | null;
  temperature: string | null;
  wind_direction: string | null;
  wind_friends: string | null;
  wind_speed: string | null;
  wind_speed_interaction: string | null;
}

interface ExploreLocationDetails extends LocationDetails {
  direction: string | null;
  direction_degree: string | null;
  explore_type: string | null;
  location_id: string | null;
  miles_away: string | null;
  origin_location: string | null;
  street_view_image: string | null;
  tags_historic: string | null;
  tags_name: string | null;
  tags_name_el: string | null;
  tags_name_mk: string | null;
  tags_source: string | null;
  wind_agreement_score: string | null;
  wind_compass: string | null;
  wind_harmony: string | null;
}

interface Choice {
  id: number;
  created_on: string;
  last_accessed: string;
  expired: boolean;
  user: string;
  explore_location: ExploreLocationDetails | null;
  twin_location: TwinLocationDetails | null;
}

interface ItemChoicesResponse {
  choices: Record<string, Choice>;
}

interface InteractiveElementsContextType {
  itemChoices: [string, Choice][];
  triggerItemChoicesRefetch: () => void;
}

const InteractiveElementsContext = createContext<
  InteractiveElementsContextType | undefined
>(undefined);

export const useInteractiveElements = (): InteractiveElementsContextType => {
  const context = useContext(InteractiveElementsContext);
  if (!context) {
    throw new Error(
      "useInteractiveElements must be used within an InteractiveElementsProvider"
    );
  }
  return context;
};

interface InteractiveElementsProviderProps {
  children: ReactNode;
}

export const InteractiveElementsProvider: React.FC<
  InteractiveElementsProviderProps
> = ({ children }) => {
  const { user, isAuthenticated, isInitializing } = useUser();
  const { currentSurroundings, locationId } = useSurroundings();
  const { lastLocationId } = useSurroundingsWS();
  const queryClient = useQueryClient();

  const {
    data: itemChoicesResponse,
    isLoading,
    isError,
  } = useQuery<ItemChoicesResponse | null>({
    queryKey: ["itemChoices", lastLocationId],
    queryFn: getItemChoices,
    enabled: !!isAuthenticated && !isInitializing && !!lastLocationId,
    onError: (err) => {
      console.error("Error fetching location data:", err);
    },
    onSuccess: (data) => {
      if (data) {
        console.log("getItemChoices success:", data);
      }
    },
  });

  // Convert itemChoices.choices (object) into an array of key-value pairs
  const itemChoices = itemChoicesResponse?.choices
    ? Object.entries(itemChoicesResponse.choices)
    : [];

  const itemChoicesAsObject = itemChoicesResponse?.choices
    ? Object.entries(itemChoicesResponse.choices).reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {}
      )
    : {};

  //Can't save treasure with this -- add twin_location__ back in whem saving the treasure
  const itemChoicesAsObjectTwin =
    itemChoicesResponse?.choices &&
    itemChoicesResponse.choices["twin_location"] !== "None"
      ? Object.entries(itemChoicesResponse.choices).reduce(
          (acc, [key, value]) => { 
            acc[key] = value;
            return acc;
          },
          {}
        )
      : {};

  const itemChoicesAsObjectExplore =
    itemChoicesResponse?.choices &&
    itemChoicesResponse.choices["explore_location"] !== "None"
      ? Object.entries(itemChoicesResponse.choices).reduce(
          (acc, [key, value]) => {
        
            acc[key] = value;
            return acc;
          },
          {}
        )
      : {};

  const strippedItemChoicesAsObjectTwin =
    itemChoicesResponse?.choices &&
    itemChoicesResponse.choices["twin_location"] !== "None"
      ? Object.entries(itemChoicesResponse.choices).reduce(
          (acc, [key, value]) => {
            // strip for simplicity
            const newKey = key.startsWith("twin_location__")
              ? key.replace("twin_location__", "")
              : key;

            acc[newKey] = value;
            return acc;
          },
          {}
        )
      : {};

  const strippedItemChoicesAsObjectExplore =
    itemChoicesResponse?.choices &&
    itemChoicesResponse.choices["explore_location"] !== "None"
      ? Object.entries(itemChoicesResponse.choices).reduce(
          (acc, [key, value]) => {
            const newKey = key.startsWith("explore_location__")
              ? key.replace("explore_location__", "")
              : key;

            acc[newKey] = value;
            return acc;
          },
          {}
        )
      : {};

  const triggerItemChoicesRefetch = () => {
    console.log("invalidating item choices query");
    queryClient.invalidateQueries({
      queryKey: ["itemChoices", lastLocationId],
      // Include currentSurroundings.id
    });
    console.log("refetching item choices query");
    queryClient.refetchQueries({
      queryKey: ["itemChoices", lastLocationId],
    });
  };


  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === "itemChoices") {
        console.log(
          "itemChoices cache updated."
          // queryClient.getQueryData([
          //   'itemChoices',
          //   currentSurroundings?.explore_location?.id ?? null,
          //   currentSurroundings?.twin_location?.id ?? null,
          // ]),
        );
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, [lastLocationId]); //passing in queryClient will trigger useEffect any time ANY query key is updated

  return (
    <InteractiveElementsContext.Provider
      value={{
        itemChoices, 
        itemChoicesAsObject,
        itemChoicesAsObjectTwin,
        itemChoicesAsObjectExplore,
        strippedItemChoicesAsObjectTwin,
        strippedItemChoicesAsObjectExplore,
        triggerItemChoicesRefetch,
      }}
    >
      {children}
    </InteractiveElementsContext.Provider>
  );
};
