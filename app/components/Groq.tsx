import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import ScrollDetailPanel from './ScrollDetailPanel';
//import { useSurroundings } from '../context/CurrentSurroundingsContext';
import { useSurroundingsWS } from '../context/SurroundingsWSContext';
import useAsyncStorageCache from '../hooks/useAsyncStorageCache';


const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

const Groq = ({ givenRole, prompt, title, cacheKey, userId }) => {
  //const { locationId } = useSurroundings();
  const { lastLocationId } = useSurroundingsWS();
  const { storedValue, setCache, getCache } = useAsyncStorageCache(userId, lastLocationId);
  const [responseMessage, setResponseMessage] = useState('');
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
  }, [lastLocationId, prompt, givenRole, cacheKey]); // Add cacheKey to dependencies
   // Runs when locationId, prompt, or givenRole changes
  
  useEffect(() => {
    if (lastLocationId) {
      console.log('LOCATION ID TRIGGERED IN GROQ: ', lastLocationId);
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

      setResponseMessage(chatResponse);
      const existingCache = await getCache(); // Retrieve existing cache
      await setCache({ ...existingCache, location_id: lastLocationId, [cacheKey]: chatResponse });
    
    } catch (error) {
      console.error('Error fetching chat completion:', error);
    }
  };

  return <ScrollDetailPanel label={title} value={responseMessage} />;
};

export default Groq;
