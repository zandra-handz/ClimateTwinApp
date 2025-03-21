import React, { useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import { searchSmithsonian } from "../smithsoniancall";

const useSmithsonian = ({ queryString, base }) => {
  const { isAuthenticated, isInitializing } = useUser();
  const { lastLocationId } = useSurroundingsWS();
  const queryClient = useQueryClient();

  const locationCacheExpiration = 1000 * 60 * 60; // 1 hour
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const safeQueryString = queryString?.trim() || "";
  const safeBase = base?.trim() || "";

  // Fetch images using react-query
  const {
    data: smithsonian,
    isLoading,
    isFetching,
    isPending,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["smithsonian", lastLocationId, safeQueryString, safeBase],
    queryFn: async () => {
      const data = await searchSmithsonian({
        searchKeyword: safeQueryString,
        locale: "en-US",
        base,
      });

      return {
        ...data,
        base, // Ensure base stays in the output
        photos: data?.response?.rows?.map((row) => ({
          id: row.id,
          title: row.title,
          url: row.content?.descriptiveNonRepeating?.record_link || null, // Main record link
          imageUrl: row.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.content || null, // Extract first image URL if exists
          alt_description: row.content?.descriptiveNonRepeating?.title?.content || "No label available",
          color: null, // No color data in response, setting to null
        })) || [],
      };
    },
    enabled: !!isAuthenticated && !!lastLocationId && !isInitializing && !!queryString,
    staleTime: locationCacheExpiration,
    gcTime: locationCacheExpiration,
    onSuccess: (data) => {
      console.log("Processed Smithsonian RESULTS: ", data.photos);
      console.log("Base in fetched data:", data.base);
    },
    onError: (error) => {
      console.log(`Smithsonian error: `, error);
    },
  });

  const smithsonianMutation = useMutation({
    mutationFn: ({ searchKeyword, locale, base }) => {
      return searchSmithsonian({ searchKeyword, locale, base });
    },
    gcTime: locationCacheExpiration,
    retry: 1,
    onSuccess: ({ photos, base }, variables) => {
      console.log(`DATA`, photos[0]);

      const { searchKeyword } = variables;
      console.log("Base in onSuccess:", searchKeyword, base);

      const processedPhotos = photos.map((photo) => ({
        ...photo,
        processed: true, // Example transformation
      }));

      const queryKey = ["smithsonian", lastLocationId, searchKeyword, base];

      queryClient.setQueryData(queryKey, { photos: processedPhotos, base });
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
        smithsonianMutation.reset();
      }, 2000);
    },
  });

  // Function to trigger smithsonian image search
  const handleGetSmithsonian = ({ searchKeyword, locale, base }) => {
    if (!lastLocationId) {
      console.error("No lastLocationId found when getting smithsonian images");
      return;
    }

    const queryKey = ["smithsonian", lastLocationId, searchKeyword, base];

    // Check if data is already cached
    const cachedData = queryClient.getQueryData(queryKey);
    if (cachedData) {
      console.log("Using cached data:", cachedData);
      return;
    }

    // Fetch new images if not cached
    smithsonianMutation.mutate({ searchKeyword, locale, base });
  };

  return {
    smithsonian,
    isFetching,
    isPending,
    isSuccess,
    handleGetSmithsonian,
    smithsonianMutation,
  };
};

export default useSmithsonian;
