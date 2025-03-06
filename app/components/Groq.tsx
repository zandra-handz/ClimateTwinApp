import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import ScrollDetailPanel from './ScrollDetailPanel';
import { useSurroundings } from '../context/CurrentSurroundingsContext';
import useAsyncStorageCache from '../hooks/useAsyncStorageCache';

const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

const Groq = ({ givenRole, prompt, title, userId }) => {
  const { locationId } = useSurroundings();
  const { storedValue, setCache, getCache } = useAsyncStorageCache(userId, locationId);
  const [responseMessage, setResponseMessage] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) {
        console.log('no locationId, not running groq chat');
        return;
      }
      console.log('LOCATION ID TRIGGERED IN GROQ: ', locationId);
  
      // Check if there's cached data specific to this locationId
      const cachedData = await getCache();
      if (cachedData) {
        console.log('Using cached data:', cachedData);
        setResponseMessage(cachedData.history); // Use cached response
      } else {
        console.log('No cached data found, calling createChatCompletion...');
        await createChatCompletion(); // Fetch new data
      }
    };
  
    fetchData();
  }, [locationId, prompt, givenRole]); // Runs when locationId, prompt, or givenRole changes
  
  useEffect(() => {
    if (locationId) {
      console.log('LOCATION ID TRIGGERED IN GROQ: ', locationId);
    }

  }, [locationId]);

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
      await setCache({ location_id: locationId, history: chatResponse }); // Cache response
    } catch (error) {
      console.error('Error fetching chat completion:', error);
    }
  };

  return <ScrollDetailPanel label={title} value={responseMessage} />;
};

export default Groq;
