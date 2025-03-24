import React, { useEffect, useState, useRef } from "react";
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
import useLiveWeather from "./useLiveWeather";
 

interface GroqHistoryData {
  [key: string]: any;
}

const useGroq = () => {
  const { isAuthenticated, isInitializing } = useUser(); 
  const { liveWeather, liveTemperature, liveWeatherId, liveWeatherString } = useLiveWeather();
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
    lastLocationName || "Unknown",
    liveWeatherString,
  );

  const rolePlant = yourRoleIsExpertBotanist();
  const promptPlant = findMeAPlant(latitude, longitude, groqHistory, "ONE");

  const roleBird = yourRoleIsImmortalBirdWatcher();
  const promptBird = findMeABird(latitude, longitude, groqHistory, "ONE");

  const roleWeapon = yourRoleIsEsteemedAndCompassionateArchaeologist();
  const promptWeapon = findMeAWeapon(latitude, longitude, groqHistory, "ONE");


  const [ currentGroqQueryKey, setCurrentGroqQueryKey ] = useState(null);
  const [currentGroqItemName, setCurrentGroqItemName] = useState<string | null>(null);





  

  const {
    data: groqHistory,
    isLoading,
    isPending,
    isFetching,
    isSuccess,
    isError,
  }: UseQueryResult<GroqHistoryData, Error> = useQuery({
    queryKey: ["groq", lastLocationId, "history", liveWeatherId, liveWeatherString],
    queryFn: () => talkToGroq({ role: roleHistory, prompt: promptHistory }),
    enabled: !!isAuthenticated && !!lastLocationId && !!liveWeatherId && !!liveWeatherString && !isInitializing,
  
    staleTime: locationCacheExpiration, //data is marked stale and refetched 
    gcTime: locationCacheExpiration, //data stays in cache even if unused
    onSuccess: (data) => {},
  });



  const getRoleAndPrompt = (keyword: string) => {
    if (keyword === "plants" || keyword === "trees") {
      return { role: rolePlant, prompt: promptPlant };
    } else if (keyword === "birds") {
      return { role: roleBird, prompt: promptBird };
    } else if (keyword === "weapons" || keyword === "ancient sword" || keyword === "ancient dagger") {
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
      setCurrentGroqQueryKey(queryKey);
    },
    gcTime: locationCacheExpiration,
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

      const name = data
      .split("\n")
      .find((line) => line.trim().startsWith("NAME:"))
      ?.replace("NAME: ", "")
      .trim() || null;

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
        name: name,
        text: data,
        images: imageUrls.length > 0 ? imageUrls : [],
      };


      console.log(`SETTING CURRENT GROQ ITEM NAME TO:`, name);
     // handleGetPexels({searchKeyword: name, locale: 'en-US'});
      setCurrentGroqItemName(name);


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


  // const handlePexels = async ({searchKeyword}) => {
  //    await searchPexels({searchKeyword: currentGroqItemName});

  // };


  // useEffect(() => {
  //   console.log("Current Groq Item Name:", currentGroqItemName);
  //   if (currentGroqItemName) {
  //     handlePexels({searchKeyword: currentGroqItemName});
  //   }
  // }, [currentGroqItemName]);
 

  const handleGetGroqItem = (keyword: string, base: string) => {
    if (!lastLocationId) {
      console.error("no lastLocationId found to get groq item with");
    }

    const queryKey = ["groq", lastLocationId, keyword, base];

    // Check if the data is already in the cache
    const cachedData = queryClient.getQueryData(queryKey);
    //setCurrentGroqQueryKey(queryKey); //not (yet) using pexel for history section of portal location
  
    if (cachedData) {
      console.log("Using cached data:", cachedData);
      console.log(queryClient.getQueryDefaults(queryKey));
      return; // Don't run the mutation if data exists
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
    currentGroqQueryKey, //to pass to pexels
    currentGroqItemName, //to pass to pexels
  };
};

export default useGroq;
