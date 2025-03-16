import axios from 'axios';  
import { useState } from 'react';

import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';  
export const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

//axios.defaults.baseURL = API_URL;
//axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;


import { Alert } from 'react-native'; 

 


//websocket token needs to update when the headers do
// export const setHeader = () => {
//     if (API_KEY) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
       
        
//     }  
// };
 

export const setRequestBody = ({ model = "llama-3.1-8b-instant", role, prompt }) => {
    if (!role || !prompt) {
        console.error("Prompt or role is missing from Groq request body");
        return null;
    }

    return {
        model,
        messages: [
            { role: "system", content: role },
            { role: "user", content: prompt },
        ],
        temperature: 0.7,
    };
};



export const talkToGroq = async ({ model = "llama-3.1-8b-instant", role, prompt }) => {
    const requestBody = setRequestBody({ model, role, prompt });

    if (!requestBody) {
        console.error("Invalid request. Role and prompt are required.");
        return ""; // Ensure it always returns a string
    }

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
        return data.choices[0]?.message?.content || ""; // Ensure string return
    } catch (error) {
        console.error("Error calling Groq API:", error.response?.data || error.message);
        return ""; // Return empty string instead of an object
    }
};
