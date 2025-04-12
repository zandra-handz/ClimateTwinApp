import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useQueryClient, UseQueryResult, useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import { useSurroundingsWS } from "./SurroundingsWSContext";
import useLLMScripts from "../../app/llm/useLLMScripts";
import { talkToGroq } from "../calls/groqcall";
import useLiveWeather from "../../app/hooks/useLiveWeather";
//import useNativePlants from "../hooks/useNativePlants";
import useINaturalist from "../../app/hooks/useINaturalist";

interface GroqHistoryData {
  [key: string]: any;
}

interface GroqContextType {
  groqHistory: GroqHistoryData | undefined;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  handleGetGroqItem: (keyword: string, base: string) => void;
  groqItemMutation: ReturnType<typeof useMutation>;
  extendGroqStaleTime: () => void;
  logGroqState: () => void;
  currentGroqQueryKey: any;
  currentGroqItemName: string | null;
}

const GroqContext = createContext<GroqContextType | undefined>(undefined);

export const useGroqContext = () => {
  const context = useContext(GroqContext);
  if (!context) {
    throw new Error("useGroqContext must be used within a GroqProvider");
  }
  return context;
};

export const GroqProvider: React.FC = ({ children }) => {
    const { isAuthenticated, isInitializing } = useUser();
    const { liveWeather, liveTemperature, liveWeatherId, liveWeatherString } = useLiveWeather();
    //const { nativePlants } = useNativePlants();
    const { iNaturalist } = useINaturalist();
    const { lastLocationName, lastLocationId, lastLatAndLong } = useSurroundingsWS();
    const [latitude, longitude] = Array.isArray(lastLatAndLong) ? lastLatAndLong : [null, null];
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
      findMeAWeapon 
    } = useLLMScripts();
  
    const locationCacheExpiration = 1000 * 60 * 60; // 1 hour to match backend
  
    const roleHistory = yourRoleIsFriendlyDiligentHistorian();
    const promptHistory = tellMeRecentHistoryOf(
      latitude,
      longitude,
      lastLocationName || "Unknown",
      liveWeatherString
    );
  
    const rolePlant = yourRoleIsExpertBotanist();
    const promptPlant = findMeAPlant(latitude, longitude, "", "ONE");
  
    const roleBird = yourRoleIsImmortalBirdWatcher();
    const promptBird = findMeABird(latitude, longitude, "", "ONE");
  
    const roleWeapon = yourRoleIsEsteemedAndCompassionateArchaeologist();
    const promptWeapon = findMeAWeapon(latitude, longitude, "", "ONE");
  
    const [currentGroqQueryKey, setCurrentGroqQueryKey] = useState(null);
    const [currentGroqItemName, setCurrentGroqItemName] = useState<string | null>(null);
  
    const { data: groqHistory, isLoading, isPending, isError } = useQuery({
      queryKey: ["groq", lastLocationId, "history", liveWeatherId],
      queryFn: () => talkToGroq({ role: roleHistory, prompt: promptHistory }),
      enabled: !!isAuthenticated && !!lastLocationId && !!liveWeatherId && !!liveWeatherString && !isInitializing,
      staleTime: locationCacheExpiration,
      gcTime: locationCacheExpiration,
      onSuccess: () => {},
    });
  
    const getRoleAndPrompt = (keyword: string, locationGroqHistory: string, query: string) => {
      if (query) {
        return { role: 'You are an explorer, a diligent fact checker and a lover of nature!', prompt: `Please describe ${query} found at coordinates ${latitude}, ${longitude}. Please incorporate current weather conditions into your description, as found here: ${locationGroqHistory}`}
      }
      if (keyword === "plants" || keyword === "trees") {
        return { role: rolePlant, prompt: findMeAPlant(latitude, longitude, locationGroqHistory, "ONE") };
      } else if (keyword === "birds") {
        return { role: roleBird, prompt: findMeABird(latitude, longitude, locationGroqHistory, "ONE") };
      } else if (keyword === "weapons" || keyword === "ancient sword" || keyword === "ancient dagger") {
        return { role: roleWeapon, prompt: findMeAWeapon(latitude, longitude, locationGroqHistory, "ONE") };
      }
      return { role: rolePlant, prompt: promptPlant };
    };
  
    const groqItemMutation = useMutation({
      mutationFn: ({ keyword, base, groqHistory, query }) => {
    
        const { role, prompt } = getRoleAndPrompt(keyword, groqHistory, query);
        if (role && prompt) {
          return talkToGroq({ role, prompt });
        }
        return Promise.reject("Invalid keyword");
      },
      onMutate: ({ keyword, base }) => {
        const queryKey = ["groq", lastLocationId, keyword, base];
        setCurrentGroqQueryKey(queryKey);
      },
      gcTime: locationCacheExpiration,
      retry: 1,
      onSuccess: (data, variables) => {
        const { keyword, base } = variables;
        const queryKey = ["groq", lastLocationId, keyword, base];
  
        const name = data.split("\n").find((line) => line.trim().startsWith("NAME:"))?.replace("NAME: ", "").trim() || null;
        const imageUrls = data.split("\n").filter((line) => line.trim().startsWith("IMAGELINK:"))
          .map((line) => line.replace("IMAGELINK:", "").trim())
          .map((url) => url.replace("/wiki/File:", "/wiki/Special:FilePath/"))
          .filter((url) => url.length > 0);
  
        const formattedData = {
          name: name,
          text: data,
          images: imageUrls.length > 0 ? imageUrls : [],
        };
  
        setCurrentGroqItemName(name);
        queryClient.setQueryData(queryKey, formattedData);
        queryClient.setQueryDefaults(queryKey, {
          staleTime: locationCacheExpiration,
          gcTime: locationCacheExpiration,
        });
      },
      onError: (error) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          groqItemMutation.reset();
        }, 2000);
      },
    });
  
    const handleGetGroqItem = (keyword: string, base: string, groqHistory: string, query?: string | null) => {
      if (!lastLocationId) {
            console.error("no lastLocationId found to get groq item with");
            return; // Add return here to stop the function execution
          }

        if (!groqHistory) {
        console.error("no lastLocationId found to get groq item with");
        return; // Add return here to stop the function execution
        }
  
      const queryKey = ["groq", lastLocationId, keyword, base];
      const cachedData = queryClient.getQueryData(queryKey);
      if (cachedData) return;
  
      groqItemMutation.mutate({ keyword, base, groqHistory, query });
    };
  
    const extendGroqStaleTime = () => {
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
  
    return (
      <GroqContext.Provider
        value={{
          groqHistory,
          isLoading,
          isPending,
          isError,
          handleGetGroqItem,
          groqItemMutation,
          extendGroqStaleTime,
          logGroqState,
          currentGroqQueryKey,
          currentGroqItemName,
        }}
      >
        {children}
      </GroqContext.Provider>
    );
  };
  