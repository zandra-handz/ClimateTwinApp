import React, { useMemo, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useUser } from "../../src/context/UserContext";
import { getHistory } from "../../src/calls/apicalls";

const useHistory = () => {
  const { isAuthenticated, isInitializing } = useUser();

  const {
    data: history,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["history"],
    queryFn: () => getHistory(),
    enabled: !!isAuthenticated && !isInitializing, //initializing may not be necessary
    onSuccess: (data) => {},
  });

  return {
    history,
  };
};

export default useHistory;
