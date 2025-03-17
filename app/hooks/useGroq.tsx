import React, { useEffect, useRef } from "react";
import { Alert } from "react-native";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import useLLMScripts from "../llm/useLLMScripts";
import { talkToGroq } from "../groqcall";

interface GroqHistoryData {
  [key: string]: any;
}

const useGroq = () => {
  const { isAuthenticated, isInitializing } = useUser();
  const { lastLocationName, lastLocationId, lastLatAndLong } =
    useSurroundingsWS();
  const [latitude, longitude] = Array.isArray(lastLatAndLong)
    ? lastLatAndLong
    : [null, null];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const {
    yourRoleIsFriendlyDiligentHistorian,
    tellMeRecentHistoryOf,
    yourRoleIsExpertBotanist,
    findMeAPlant,
    yourRoleIsImmortalBirdWatcher,
    findMeABird,
    yourRoleIsEsteemedAndCompassionateArchaeologist,
    findMeAWeapon,
  } = useLLMScripts();


  const locationCacheExpiration = 1000 * 60 * 60; // 1 hour to match backend 


  const roleHistory = yourRoleIsFriendlyDiligentHistorian();
  const promptHistory = tellMeRecentHistoryOf(
    latitude,
    longitude,
    lastLocationName || "Unknown"
  );

  const rolePlant = yourRoleIsExpertBotanist();
  const promptPlant = findMeAPlant(latitude, longitude, groqHistory, "ONE");

  const roleBird = yourRoleIsImmortalBirdWatcher();
  const promptBird = findMeABird(latitude, longitude, groqHistory, "ONE");

  const roleWeapon = yourRoleIsEsteemedAndCompassionateArchaeologist();
  const promptWeapon = findMeAWeapon(latitude, longitude, groqHistory, "ONE");


  

  const {
    data: groqHistory,
    isLoading,
    isPending,
    isFetching,
    isSuccess,
    isError,
  }: UseQueryResult<GroqHistoryData, Error> = useQuery({
    queryKey: ["groq", lastLocationId, "history"],
    queryFn: () => talkToGroq({ role: roleHistory, prompt: promptHistory }),
    enabled: !!isAuthenticated && !!lastLocationId && !isInitializing,
    staleTime: locationCacheExpiration, //data is marked stale and refetched 
    gcTime: locationCacheExpiration, //data stays in cache even if unused
    onSuccess: (data) => {},
  });



  const getRoleAndPrompt = (keyword: string) => {
    if (keyword === "plants") {
      return { role: rolePlant, prompt: promptPlant };
    } else if (keyword === "birds") {
      return { role: roleBird, prompt: promptBird };
    } else if (keyword === "travel") {
      return { role: roleWeapon, prompt: promptWeapon };
    }
    return { role: rolePlant, prompt: promptPlant };
  };

  const groqItemMutation = useMutation({
    mutationFn: ({ keyword, base }) => {
      const { role, prompt } = getRoleAndPrompt(keyword); // Get the correct role and prompt
      // console.log(keyword);
      // console.log(base);
      // console.log(role);
      // console.log(prompt);
      if (role && prompt) {
        return talkToGroq({ role: role, prompt: prompt });
      }
      return Promise.reject("Invalid keyword");
    },
    onMutate: ({ keyword, base }) => {
      const queryKey = ["groq", lastLocationId, keyword, base];
      console.log("Mutation key:", queryKey);
    },
    retry: 1,
    onSuccess: (data, variables) => {
      if (!data || typeof data !== "string") {
        Alert.alert(
          "Error",
          `Unexpected response from Groq API: ${JSON.stringify(data)}`
        );
        console.log("Retrying due to invalid data...");
        throw new Error("Invalid response from API");  
   
      }

      const { keyword, base } = variables;
      const queryKey = ["groq", lastLocationId, keyword, base];

      const imageUrls = data
        .split("\n")
        .filter(
          (line) =>
            typeof line === "string" && line.trim().startsWith("IMAGELINK:")
        )
        .map((line) => line.replace("IMAGELINK:", "").trim())
        .map((url) => url.replace("/wiki/File:", "/wiki/Special:FilePath/"))
        .filter((url) => url.length > 0);

      const formattedData = {
        text: data,
        images: imageUrls.length > 0 ? imageUrls : [],
      };

      queryClient.setQueryData(queryKey, formattedData);

      //not sure if this works
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
        groqItemMutation.reset();
      }, 2000);
    },
  });
 

  const handleGetGroqItem = (keyword: string, base: string) => {
    if (!lastLocationId) {
      console.error("no lastLocationId found to get groq item with");
    }

    // Pass the parameters as an object
    groqItemMutation.mutate({ keyword, base });
  };

//calling this in handlePickNewSurroundings mutation onSuccess,
// to reset stale time every time a ruin/portal location is visited or revisited,
// since this is what is also happening on backend 
  const extendGroqStaleTime = () => {
    console.log('extending stale time for groq portal location summary', lastLocationId);
    queryClient.setQueryDefaults(["groq", lastLocationId], {
      staleTime: locationCacheExpiration,
      gcTime: locationCacheExpiration,
    });
  };

 
  const logGroqState = () => {
    const queryKey = ["groq", lastLocationId];
    const queryState = queryClient.getQueryState(queryKey); 
      console.log("Last Updated At:", new Date(queryState?.dataUpdatedAt || 0)); 
 
  };
  
  return {
    groqHistory,
    isLoading,
    isPending,
    isFetching,
    isSuccess,
    isError,
    handleGetGroqItem,
    groqItemMutation,
    extendGroqStaleTime,
    logGroqState,
  };
};

export default useGroq;
