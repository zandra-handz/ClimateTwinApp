import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import ScrollDetailPanel from './ScrollDetailPanel'; 
import { useSurroundingsWS } from '../context/SurroundingsWSContext';
import useAsyncStorageCache from '../hooks/useAsyncStorageCache';
import useLLMScripts from '../llm/useLLMScripts';
import { Animated } from 'react-native';


const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

const GroqHistory = ({ title, cacheKey='history', userId, opacity }) => { 
  const { lastLocationId, lastLocationName, lastLatAndLong } = useSurroundingsWS();
  const [latitude, longitude] = Array.isArray(lastLatAndLong) ? lastLatAndLong : [null, null];


  const { setCache, getCache } = useAsyncStorageCache(userId, lastLocationId);
  const [responseMessage, setResponseMessage] = useState('');
  const { yourRoleIsFriendlyDiligentHistorian, tellMeRecentHistoryOf } =
    useLLMScripts(); 
    
  useEffect(() => {
    const fetchData = async () => {
      if (!lastLatAndLong) {
        console.log('no location lat and long, not running groq chat');
        return;
      }
      console.log('LOCATION ID TRIGGERED IN GROQ: ', lastLocationId);
   
      const cachedData = await getCache();
      if (cachedData && cachedData.hasOwnProperty(cacheKey)) {
        console.log('Using cached data for key:', cacheKey);
        setResponseMessage(cachedData[cacheKey]);  
      } else {
        console.log('No cached data found for key:', cacheKey);
 

        await createChatCompletion();  
      }
    };
  
    fetchData();
  }, [lastLatAndLong, cacheKey]); 
  
  useEffect(() => {
    if (lastLocationId) {
      console.log(`LOCATION ID TRIGGERED IN GROQ FOR ${cacheKey}: `, lastLocationId);
    }

  }, [lastLocationId]);

  const createChatCompletion = async () => {
    let roleData = yourRoleIsFriendlyDiligentHistorian();
    let promptData = tellMeRecentHistoryOf(
      latitude,
      longitude,
      lastLocationName || 'Unknown'
    );
  
    const requestBody = {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: roleData },
        { role: 'user', content: promptData },
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
      console.log(data.choices[0]?.message?.content);
   
      setResponseMessage(chatResponse);
   
      const existingCache = await getCache();  
      const updatedCache = {
        ...existingCache,
        location_id: lastLocationId,
        [cacheKey]: chatResponse, 
      };
   
      await setCache(updatedCache);
  
    } catch (error) {
      console.error('Error fetching chat completion:', error);
    }
  };
  

  return <ScrollDetailPanel label={title} value={responseMessage} opacity={opacity} />;
};

export default GroqHistory;
