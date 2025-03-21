 //rate limit for Pexels is 200 requests per hour as of 3/17/2025, per documentation
import Constants from "expo-constants"; 
export const API_URL = 'https://api.pexels.com/v1/search';

export const API_KEY = Constants.expoConfig?.extra?.PEXELS_API_KEY;
 

import { Alert } from 'react-native'; 
 

export const setRequestBody = ({ searchKeyword, locale }) => {

    if (!searchKeyword) {
        console.error("Prompt or role is missing from Groq request body");
        return null;
    }

    return {
        query: searchKeyword,
        locale: locale, // 'en-US' 'pt-BR' 'es-ES' 'ca-ES' 'de-DE' 'it-IT' 'fr-FR' 'sv-SE' 'id-ID' 'pl-PL' 'ja-JP' 'zh-TW' 'zh-CN' 'ko-KR' 'th-TH' 'nl-NL' 'hu-HU' 'vi-VN' 'cs-CZ' 'da-DK' 'fi-FI' 'uk-UA' 'el-GR' 'ro-RO' 'nb-NO' 'sk-SK' 'tr-TR' 'ru-RU'.
        orientation: `landscape`, //landscape, portrait, or square
        size: `medium`, //large(24MP), medium(12MP) or small(4MP)
        //color: //any hex color as well as common color works
        //page: //default is 1
        //per_page: //default is 15, max is 80
        total_results: 5,
        //prev_page: //url for prev page if applicable
        //next_page: //url for next page if applicable
    };
};

 
export const searchPexels = async ({ searchKeyword, locale = "en-US", base }) => {
    console.log("searchPexels call triggered, searchKeyword: ", searchKeyword);

    if (!searchKeyword) {
        console.error("Invalid request. Search keyword is required.");
        return { photos: [], base }; 
    }

    const url = `${API_URL}?query=${encodeURIComponent(searchKeyword)}&locale=${locale}&orientation=landscape&size=medium&per_page=5`;
    console.log(url);
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: API_KEY, // No need for "Bearer"
            },
        });

        if (!response.ok) {
            throw new Error(`Pexels API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        //console.log(data.photos);
        return { photos: data.photos || [], base };  
    } catch (error) {
        console.error("Error calling Pexels API:", error);
        return { photos: [], base }; 
    }
};

