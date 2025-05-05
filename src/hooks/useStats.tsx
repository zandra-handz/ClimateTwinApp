//THIS IS FOR MY OWN OBSERVATION WHILE TESTING/PLAYING AROUND
 
import { useQuery  } from "@tanstack/react-query";

import { useUser } from "../context/UserContext";
import { getStats } from "../calls/apicalls";

const useStats = () => {
  const { isAuthenticated, isInitializing } = useUser();

  const {
    data: stats,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
    enabled: !!isAuthenticated && !isInitializing, //initializing may not be necessary
 
  });

  return {
    stats,
  };
};

export default useStats;
