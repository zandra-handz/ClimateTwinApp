import React, { useMemo, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useUser } from "../context/UserContext";
import { useUserSettings } from "../context/UserSettingsContext";
import { getHistory } from "../calls/apicalls";

const useHistory = () => {
  const { isAuthenticated, isInitializing } = useUser();
  const { settingsAreLoading } = useUserSettings();

  const {
    data: history,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["history"],
    queryFn: () => getHistory(),
    enabled: !!isAuthenticated && !settingsAreLoading, //initializing may not be necessary
    onSuccess: (data) => {},
  });

  return {
    history,
  };
};

export default useHistory;
