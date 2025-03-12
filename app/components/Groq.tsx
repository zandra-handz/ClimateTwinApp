import { useEffect, useState } from 'react';

import Constants from 'expo-constants';
import ScrollDetailPanel from './ScrollDetailPanel';
//import { useSurroundings } from '../context/CurrentSurroundingsContext';
import { useSurroundingsWS } from '../context/SurroundingsWSContext';
import useAsyncStorageCache from '../hooks/useAsyncStorageCache';
import useLLMScripts from '../llm/useLLMScripts';


const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

const Groq = ({ givenRole, prompt, title, cacheKey, topic, userId }) => {
  //const { locationId } = useSurroundings();
  const { lastLocationId, lastLocationName, lastLatAndLong } = useSurroundingsWS();
  const [ latitude, longitude ] = lastLatAndLong;

  const { setCache, getCache } = useAsyncStorageCache(userId, lastLocationId);
  const [responseMessage, setResponseMessage] = useState('');
  const { yourRoleIsFriendlyDiligentHistorian, 
    tellMeRecentHistoryOf,
    yourRoleIsExpertBotanist,
    findMeFiveLocalPlants,
   } =
    useLLMScripts();

  useEffect(() => {
    const fetchData = async () => {
      if (!lastLocationId) {
        console.log('no locationId, not running groq chat');
        return;
      }
      console.log('LOCATION ID TRIGGERED IN GROQ: ', lastLocationId);
  
      // Check if there's cached data specific to this locationId
      const cachedData = await getCache();
      if (cachedData && cachedData.hasOwnProperty(cacheKey)) {
        console.log('Using cached data for key:', cacheKey);
        setResponseMessage(cachedData[cacheKey]); // Use cached response
      } else {
        console.log('No cached data found for key:', cacheKey);
        await createChatCompletion(); // Fetch new data
      }
    };
  
    fetchData();
  }, [lastLocationId, cacheKey]); // Add cacheKey to dependencies
   // Runs when locationId, prompt, or givenRole changes
  
  useEffect(() => {
    if (lastLocationId) {
      console.log(`LOCATION ID TRIGGERED IN GROQ FOR ${cacheKey}: `, lastLocationId);
    }

  }, [lastLocationId]);

const createChatCompletion = async () => {
  const requestBody = {
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: givenRole },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    const chatResponse = data.choices[0]?.message?.content || 'No response available';
    console.log(data.choices[0]?.message?.content.slice(0, 100));
    console.log(chatResponse.slice(0,100));

    // Set the response message state
    setResponseMessage(chatResponse);

    // Ensure necessary values are available and properly set
    if (lastLocationId && cacheKey && chatResponse) {
      // Retrieve existing cache
      const existingCache = await getCache();

      // Prepare the updated cache with new data
      const updatedCache = {
        ...existingCache,
        location_id: lastLocationId, // Ensure location ID is set
        [cacheKey]: chatResponse, // Set the new chat response data under cacheKey
      };

      // Save the updated cache
      await setCache(updatedCache);
    } else {
      console.warn('Missing required data to update cache. Ensure lastLocationId, cacheKey, and chatResponse are available.');
    }
  } catch (error) {
    console.error('Error fetching chat completion:', error);
  }
};


  return <ScrollDetailPanel label={title} value={responseMessage} />;
};

export default Groq;
