import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import SingleDetailPanel from './SingleDetailPanel';
import ScrollDetailPanel from './ScrollDetailPanel';
import Constants from 'expo-constants'; 

const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

const Groq = ({givenRole, prompt, title}) => {
  const [responseMessage, setResponseMessage] = useState('');
 
  // Function to create chat completion
  const createChatCompletion = async () => {
    const requestBody = {
      model: 'llama-3.1-8b-instant',  // Replace with your actual model ID
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
      //console.log(data);
      setResponseMessage(data.choices[0].message.content);  // Assuming the response has this structure
    } catch (error) {
      console.error('Error fetching chat completion:', error);
    }
  };

  useEffect(() => {
    createChatCompletion();
  }, [prompt, givenRole]);  // Now it depends on both prompt and givenRole
  

  return (
    <ScrollDetailPanel
      label={`${title}`}
      value={`${responseMessage}`}
    />
  );
}

export default Groq;
