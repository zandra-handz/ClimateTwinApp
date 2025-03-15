import { useLayoutEffect, useEffect, useState } from "react";

import Constants from "expo-constants";
import { useSurroundingsWS } from "../../context/SurroundingsWSContext";
import { useUser } from "@/app/context/UserContext";
import useAsyncStorageCache from "../../hooks/useAsyncStorageCache";
import GroqFullScreen from "./GroqFullScreen";
import useLLMScripts from "@/app/llm/useLLMScripts";

const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

const GroqItem = ({
  name,
  title,
  base,
  topic,
  isMinimized,
  fullScreenToggle,
  isKeyboardVisible,
}) => {
  const { lastLocationId, lastLatAndLong } = useSurroundingsWS();
  const { user } = useUser();

  const [imagesArray, setImagesArray] = useState([]);

  const {
    yourRoleIsBrilliantNaturalistAndPainter,
    findMeAWindTreasure,
    yourRoleIsExpertBotanist,
    findMeAPlant,
    yourRoleIsImmortalBirdWatcher,
    findMeABird,
  } = useLLMScripts();
  const { setCache, getCache } = useAsyncStorageCache(user?.id, lastLocationId);
  const [responseMessage, setResponseMessage] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const [cachedHistory, setCachedHistory] = useState(null);
  const [confirmedNoCache, setConfirmedNoCache] = useState(false);

  const [prompt, setPrompt] = useState(null);
  const [role, setRole] = useState(null);

  const fetchCache = async () => {
    const cachedData = await getCache();
    if (cachedData?.history) {
      setCachedHistory(cachedData.history);
      setConfirmedNoCache(false);
    } else {
      setConfirmedNoCache(true);
      setCachedHistory(null);
    }
  };

  useEffect(() => {
    if (base) {
      fetchCache();
    }
  }, [base]);

  useEffect(() => {
    if (cachedHistory && lastLatAndLong && topic) {
      if (topic === "plants") {
        console.log("setting prompt for plants!");
        let roleData = yourRoleIsExpertBotanist();
        let promptData = findMeAPlant(
          lastLatAndLong[0],
          lastLatAndLong[1],
          cachedHistory
        );
        setPrompt(promptData);
        //  console.log(`prompt in parent:`, promptData);
        setRole(roleData);
      } else if (topic === "birds") {
        console.log("setting prompt for birds!");
        let roleData = yourRoleIsImmortalBirdWatcher();
        let promptData = findMeABird(
          lastLatAndLong[0],
          lastLatAndLong[1],
          cachedHistory
        );
        setPrompt(promptData);
        // console.log(`prompt in parent:`, promptData);
        setRole(roleData);
      } else {
        let roleData = yourRoleIsBrilliantNaturalistAndPainter();
        let promptData = findMeAWindTreasure(
          lastLatAndLong[0],
          lastLatAndLong[1],
          cachedHistory
        );
        setPrompt(promptData);
        setRole(roleData);
      }
    }
  }, [cachedHistory, topic]);

  useEffect(() => {
    //  console.log('use effect in Groq triggered by prompt', prompt);
    //setResponseMessage(null);
    if (prompt) {
      const fetchData = async () => {
        setShowSpinner(true);
        const cachedData = await getCache();
        if (cachedData && cachedData.hasOwnProperty(base)) {
          //  console.log("Using cached data for key:", base);
          setResponseMessage(cachedData[base]);
          setImagesArray(cachedData[`${base}_images`]);
          //  console.log('CACHED DATA RETRIEVED!', cachedData[base]);
        } else {
          //   console.log("No cached data found for key:", base);
          await createChatCompletion({ prompt, role });
        }
        setShowSpinner(false);
      };
      fetchData();
    }
  }, [prompt]);

  const createChatCompletion = async ({ prompt, role }) => {
    //console.log(`topic in groq:`, topic);
    //console.log(`prompt in groq:`, prompt);

    const requestBody = {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: role },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    };

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      const chatResponse =
        data.choices[0]?.message?.content || "No response available";
      //console.log(data.choices[0]?.message?.content.slice(0, 100));
      //console.log(chatResponse.slice(0,100));

      const imageUrls = chatResponse
        ? chatResponse
            .split("\n")
            .filter(
              (line) =>
                typeof line === "string" && line.trim().startsWith("IMAGELINK:")
            )
            .map((line) => line.replace("IMAGELINK:", "").trim())
            .map((url) => url.replace("/wiki/File:", "/wiki/Special:FilePath/")) // Convert to direct image URL
            .filter((url) => url.length > 0)
        : [];

      setImagesArray(imageUrls.length > 0 ? imageUrls : []);
      console.log("Corrected Image URLs:", imageUrls);

      if (lastLocationId && base && chatResponse) {
        const existingCache = await getCache();

        const updatedCache = {
          ...existingCache,
          location_id: lastLocationId,
          [base]: chatResponse,
          [`${base}_images`]: imagesArray,
        };

        // Save the updated cache
        await setCache(updatedCache);
        setResponseMessage(chatResponse);
      } else {
        console.warn(
          "Missing required data to update cache. Ensure lastLocationId, base, and chatResponse are available."
        );
      }
    } catch (error) {
      console.error("Error fetching chat completion:", error);
    }
  };

  // useEffect(() => {
  //   if (imagesArray) {
  //     console.log(`IMAGES ARRAY!`, imagesArray);
  //   }
  // }, [imagesArray]);

  return (
    <>
      <GroqFullScreen
        label={title}
        value={responseMessage}
        opacity={1}
        images={imagesArray}
        fullScreenToggle={fullScreenToggle}
        isMinimized={isMinimized}
        isLoading={showSpinner}
        isKeyboardVisible={isKeyboardVisible}
      />
    </>
  );
};

export default GroqItem;
