// import { useEffect, useState } from "react";

// import Constants from "expo-constants"; 
// import { useSurroundingsWS } from "../../context/SurroundingsWSContext";
// import useAsyncStorageCache from "../../hooks/useAsyncStorageCache"; 
// import GroqFullScreen from "./GroqFullScreen";

// const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

// const Groq = ({ name, givenRole, prompt, title, cacheKey,topic,  userId, isMinimized, fullScreenToggle, isKeyboardVisible }) => {
 
//   const { lastLocationId } =
//     useSurroundingsWS(); 

//   const [imagesArray, setImagesArray] = useState([]);

//   const { setCache, getCache } = useAsyncStorageCache(userId, lastLocationId);
//   const [responseMessage, setResponseMessage] = useState(""); 
//   const [ showSpinner, setShowSpinner ] = useState(true);
 

//   useEffect(() => {
//     console.log('use effect in Groq triggered by cacheKey');
//     setResponseMessage(null);
//     const fetchData = async () => {
      
//     setShowSpinner(true);
//       if (!lastLocationId) {
//         console.log("no locationId, not running groq chat");
//         return;
//       }

//       if (!prompt) {
//         console.log("prompt not ready");
//         return;
//       }
//      // console.log("LOCATION ID TRIGGERED IN GROQ: ", lastLocationId);
 
//       const cachedData = await getCache();
//       if (cachedData && cachedData.hasOwnProperty(cacheKey)) {
//         console.log("Using cached data for key:", cacheKey);
//         setResponseMessage(cachedData[cacheKey]); 
//         setImagesArray(cachedData[`${cacheKey}_images`]);
//         console.log('CACHED DATA RETRIEVED!', cachedData[cacheKey]);
//       } else {
//         console.log("No cached data found for key:", cacheKey);
//         await createChatCompletion();  
//       }
//       setShowSpinner(false);
//     }; 
//     fetchData(); 

//   }, [cacheKey, prompt]);   

//   const createChatCompletion = async () => {
//     console.log(`topic in groq:`, topic);
//     console.log(`prompt in groq:`, prompt);

//     const requestBody = {
//       model: "llama-3.1-8b-instant",
//       messages: [
//         { role: "system", content: givenRole },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,
//     };

//     try {
//       const response = await fetch(
//         "https://api.groq.com/openai/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${API_KEY}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       const data = await response.json();
//       const chatResponse =
//         data.choices[0]?.message?.content || "No response available";
//       //console.log(data.choices[0]?.message?.content.slice(0, 100));
//       //console.log(chatResponse.slice(0,100));

//       const imageUrls = chatResponse
//         ? chatResponse
//             .split("\n")
//             .filter(
//               (line) =>
//                 typeof line === "string" && line.trim().startsWith("IMAGELINK:")
//             )
//             .map((line) => line.replace("IMAGELINK:", "").trim())
//             .map((url) => url.replace("/wiki/File:", "/wiki/Special:FilePath/")) // Convert to direct image URL
//             .filter((url) => url.length > 0)
//         : [];

//       setImagesArray(imageUrls.length > 0 ? imageUrls : []);
//       console.log("Corrected Image URLs:", imageUrls);
 
//       if (lastLocationId && cacheKey && chatResponse) { 
//         const existingCache = await getCache();
 
//         const updatedCache = {
//           ...existingCache,
//           location_id: lastLocationId,  
//           [cacheKey]: chatResponse,  
//           [`${cacheKey}_images`]: imagesArray,
//         };

//         // Save the updated cache
//         await setCache(updatedCache);
//         setResponseMessage(chatResponse);
//       } else {
//         console.warn(
//           "Missing required data to update cache. Ensure lastLocationId, cacheKey, and chatResponse are available."
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching chat completion:", error);
//     }
//   };
 
//   // useEffect(() => {
//   //   if (imagesArray) {
//   //     console.log(`IMAGES ARRAY!`, imagesArray);
//   //   }
//   // }, [imagesArray]);

//   return (
//     <>  
      
//         <GroqFullScreen
//           label={title}
//           value={responseMessage}
//           opacity={1}
//           images={imagesArray}
//           fullScreenToggle={fullScreenToggle}
//           isMinimized={isMinimized}
//           isLoading={showSpinner}
//           isKeyboardVisible={isKeyboardVisible}
//         /> 
         
//     </>
//   );
// };

// export default Groq;
