import React, {useRef, useState, useEffect }from "react";
import { Alert } from "react-native";
import {
    useQuery,
    useQueryClient,
    UseQueryResult,
    useMutation,
  } from "@tanstack/react-query";
import { useUser } from "../../src/context/UserContext";
import { useSurroundingsWS } from "../../src/context/SurroundingsWSContext"; 
import { searchPexels } from "../../src/calls/pexelscall";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";


interface pexelsImageData {
  [key: string]: any;
}

const usePexels = ({queryString, base}) => {
  const { isAuthenticated, isInitializing } = useUser();
 

  const { lastLocationId } = useSurroundingsWS();
  const queryClient = useQueryClient();
  
  const locationCacheExpiration = 1000 * 60 * 60; // 1 hour
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  //const [pexels, setPexels ] = useState('');

  const safeQueryString = queryString?.trim() || "";
  const safeBase = base?.trim() || "";
  
  const {
    data: pexels,
    isLoading,
    isFetching,
    isPending,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["pexels", lastLocationId, safeQueryString, safeBase],
    queryFn: () => searchPexels({ searchKeyword: safeQueryString, locale: "en-US", base: base }),
    
    enabled: !!isAuthenticated && !!lastLocationId && !isInitializing && !!queryString,
    staleTime: locationCacheExpiration,
    gcTime: locationCacheExpiration,
    onSuccess: (data) => {
      console.log('PEXELS!: ', data.response);
    },
    onError: (error) => {
      console.log(`Pexels error: `, error);
    }
  });


    const pexelsMutation = useMutation({
      mutationFn: ({ searchKeyword, locale, base}) => {
    
          return searchPexels({ searchKeyword, locale, base });
        } ,
    //   onMutate: ({ keyword, base }) => {
    //     const queryKey = ["groq", lastLocationId, keyword, base];
    //     console.log("Mutation key:", queryKey);
    //     setCurrentGroqQueryKey(queryKey);
    //   },
      gcTime: locationCacheExpiration,
      retry: 1,
      onSuccess: ({ photos, base }, variables) => {  // ✅ Destructure properly
        console.log(`DATA`, photos[0]);
    
        setPexels(photos[0]?.landscape);
    
        const { searchKeyword } = variables;
        console.log("Base in onSuccess:", searchKeyword, base);  
    
        const queryKey = ["pexels", lastLocationId, searchKeyword, base];
    
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
          pexelsMutation.reset();
        }, 2000);
      },
    });
   
   
  // Needs base data (data from elsewhere in app)
    const handleGetPexels = ({ searchKeyword, locale, base }: { searchKeyword: string, locale: string, base: string }) => {
        if (!lastLocationId) {
          console.error("no lastLocationId found when getting pexel images");
        }
      
        const queryKey = ["pexels", lastLocationId, searchKeyword, base];
      
        // Check if the data is already in the cache
        const cachedData = queryClient.getQueryData(queryKey);
      
        if (cachedData) {
          console.log("Using cached data:", cachedData);
          console.log(queryClient.getQueryDefaults(queryKey));
          return; // Don't run the mutation if data exists
        }
      
        // Pass the parameters as an object
        pexelsMutation.mutate({ searchKeyword, locale, base });
      };
      


    // useEffect(() => {
    //     if (pexels) {
    //         console.log(`pexels updated: `, pexels);
    //             }

    // }, [pexels]);

  return { 
    pexels,
    isFetching,
    isPending,
    isSuccess,
    handleGetPexels,
    pexelsMutation,
  };
};

export default usePexels;
