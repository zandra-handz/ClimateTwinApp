//THIS IS FOR MY OWN OBSERVATION WHILE TESTING/PLAYING AROUND

import React, { useMemo, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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
    onSuccess: (data) => {},
  });

  return {
    stats,
  };
};

export default useStats;
