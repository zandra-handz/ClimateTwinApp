import React, { useMemo, useRef } from "react";
import { useQuery, useQueryClient  } from "@tanstack/react-query";

import { useUser } from "../context/UserContext";
import { useUserSettings } from "../context/UserSettingsContext";
import { getHistory } from "../calls/apicalls";

const useHistory = () => {
  const { user, isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const queryClient = useQueryClient();

  const {
    data: history,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["history", user?.id],
    queryFn: () => getHistory(),
    enabled: !!isAuthenticated && !settingsAreLoading, //initializing may not be necessary
  
  });

  
  const triggerHistoryRefetch = () => {  
    queryClient.invalidateQueries({ queryKey: ["history", user?.id] });
    queryClient.refetchQueries({ queryKey: ["history", user?.id] });  
  };


  return {
    history,
    triggerHistoryRefetch,
  };
};

export default useHistory;
