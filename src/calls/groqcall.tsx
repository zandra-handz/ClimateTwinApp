import axios from 'axios';  
import { useState } from 'react';

import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';  
export const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

//import { EXPO_PUBLIC_GROQ_API_KEY } from "@.env";

// export const API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

export const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

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

export const modelOptionOne =  "llama-3.1-8b-instant"
export const modelOptionTwo = "llama3-8b-8192"
export const modelOptionThree = "gemma2-9b-it"
export const modelOptionFour = "llama-3.2-90b-vision-preview" //dev model not recommended for production
//this randomly stopped working 3/18 around 6pm, switched to option one and was fine


export const talkToGroq = async ({ model = modelOptionOne, role, prompt }) => {
    const requestBody = setRequestBody({ model, role, prompt });

    if (!requestBody) {
        console.error("Invalid request. Role and prompt are required.");
        return ""; // Ensure it always returns a string
    }

    try {
        const response = await axios.post('/climatevisitor/groq/', { 'model': model, 'role': role, 'prompt' : prompt });
    //console.log(response.data.response); 
       // console.log( JSON.stringify(requestBody))
        return response.data.response || ""; 
    } catch (e) {
        console.log('error checking reset code:', e);
        return { error: true, msg: e.response.data.msg };
    }


    // try {
    //     const response = await fetch(
    //         "https://api.groq.com/openai/v1/chat/completions",
    //         {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${API_KEY}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(requestBody),
    //         }
    //     );

    //     const data = await response.json();
    //    // console.log( JSON.stringify(requestBody))
    //     return data.choices[0]?.message?.content || ""; // Ensure string return
    // } catch (error) {
        
    //     console.error("Error calling Groq API:", error.response?.data || error.message);
    //    // console.log( JSON.stringify(requestBody))
    //     return ""; // Return empty string instead of an object
    // }
};
