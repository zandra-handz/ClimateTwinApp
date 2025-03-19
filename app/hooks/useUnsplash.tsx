import React, { useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import { searchUnsplash } from "../unsplashcall";

const useUnsplash = ({ queryString, base }) => {
  const { isAuthenticated, isInitializing } = useUser();
  const { lastLocationId } = useSurroundingsWS();
  const queryClient = useQueryClient();

  const locationCacheExpiration = 1000 * 60 * 60; // 1 hour
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const safeQueryString = queryString?.trim() || "";
  const safeBase = base?.trim() || "";

  // Fetch images using react-query
  const {
    data: unsplash,
    isLoading,
    isFetching,
    isPending,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["unsplash", lastLocationId, safeQueryString, safeBase],
    queryFn: () => searchUnsplash({ searchKeyword: safeQueryString, locale: "en-US", base }),
    enabled: !!isAuthenticated && !!lastLocationId && !isInitializing && !!queryString,
    staleTime: locationCacheExpiration,
    gcTime: locationCacheExpiration,
    onSuccess: (data) => {
      console.log("UNSPLASH RESULTS: ", data.photos);
    },
    onError: (error) => {
      console.log(`Unsplash error: `, error);
    },
  });

  const unsplashMutation = useMutation({
    mutationFn: ({ searchKeyword, locale, base }) => {
      return searchUnsplash({ searchKeyword, locale, base });
    },
    gcTime: locationCacheExpiration,
    retry: 1,
    onSuccess: ({ photos, base }, variables) => {
      console.log(`DATA`, photos[0]);

      const { searchKeyword } = variables;
      console.log("Base in onSuccess:", searchKeyword, base);

      const queryKey = ["unsplash", lastLocationId, searchKeyword, base];

      queryClient.setQueryData(queryKey, photos);
      queryClient.setQueryDefaults(queryKey, {
        staleTime: locationCacheExpiration,
        gcTime: locationCacheExpiration,
      });
    },
    onError: (error) => {
      console.log("error", error);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        unsplashMutation.reset();
      }, 2000);
    },
  });

  // Function to trigger Unsplash image search
  const handleGetUnsplash = ({ searchKeyword, locale, base }) => {
    if (!lastLocationId) {
      console.error("No lastLocationId found when getting Unsplash images");
      return;
    }

    const queryKey = ["unsplash", lastLocationId, searchKeyword, base];

    // Check if data is already cached
    const cachedData = queryClient.getQueryData(queryKey);
    if (cachedData) {
      console.log("Using cached data:", cachedData);
      return;
    }

    // Fetch new images if not cached
    unsplashMutation.mutate({ searchKeyword, locale, base });
  };

  return {
    unsplash,
    isFetching,
    isPending,
    isSuccess,
    handleGetUnsplash,
    unsplashMutation,
  };
};

export default useUnsplash;
