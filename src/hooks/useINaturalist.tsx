
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useUserSettings } from "../context/UserSettingsContext";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import { getINaturalist } from "../calls/inaturalistcall";

interface INaturalistObservation {
  id: number;
  created_at: string;
  updated_at: string;
  observed_on: string;
  location: string;
  place_guess: string;
  description: string;
  photos: any[];
  uri: string;
  user: {
    id: number;
    login: string;
  };
  quality_grade: string;
  taxon: {
    id: number;
    name: string;
  };
}

interface INaturalist {
  page: number;
  per_page: number;
  results: INaturalistObservation[];
}
 

const useINaturalist = () => {
  const { user, isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { lastLocationId, lastLatAndLong } = useSurroundingsWS();
  const [lat, lon] = Array.isArray(lastLatAndLong) ? lastLatAndLong : [null, null];
  const locationCacheExpiration = 1000 * 60 * 60; // 1 hour
 

  const {
    data: iNaturalist, 
    isPending: iNaturalistIsPending,
    isSuccess: iNaturalistIsSuccess,
    isError: iNaturalistIsError,
  } = useQuery<INaturalist | null>({
    queryKey: ["iNaturalist", lastLocationId, lat, lon, user?.id],
    queryFn: () => getINaturalist({ lat, lon }),
    enabled: !!isAuthenticated && !!lastLocationId && !settingsAreLoading && !!lastLatAndLong,
    staleTime: locationCacheExpiration,
    gcTime: locationCacheExpiration,
  });
 

  return { iNaturalist, iNaturalistIsPending, iNaturalistIsSuccess, iNaturalistIsError };
};

export default useINaturalist;
