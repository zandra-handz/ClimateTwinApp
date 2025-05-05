import React, {
  createContext,
  useContext, 
  ReactNode, 
} from "react";
import { useUser } from "./UserContext";
import { useUserSettings } from "./UserSettingsContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItemChoices } from "../calls/apicalls"; 
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
  const { user, isAuthenticated } = useUser(); 
  const { settingsAreLoading } = useUserSettings();
  const { lastLocationId } = useSurroundingsWS();
  const queryClient = useQueryClient();

 

  const {
    data: itemChoicesResponse,
    isLoading,
    isSuccess,
    isError,
  } = useQuery<ItemChoicesResponse | null, Error>({
    queryKey: ["itemChoices", lastLocationId, user?.id],
    queryFn: getItemChoices,
    enabled: !!isAuthenticated && !settingsAreLoading && !!lastLocationId,
  });
  

  const triggerItemChoicesRefetch = () => { 
    queryClient.invalidateQueries({
      queryKey: ["itemChoices"],
 
    }); 
    // queryClient.refetchQueries({
    //   queryKey: ["itemChoices", lastLocationId, user?.id],
    // });
  };


 
  return (
    <InteractiveElementsContext.Provider
      value={{ 
        itemChoicesResponse,  
        triggerItemChoicesRefetch,
      }}
    >
      {children}
    </InteractiveElementsContext.Provider>
  );
};
