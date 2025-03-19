import Constants from "expo-constants"; 

export const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
export const UNSPLASH_API_KEY = Constants.expoConfig?.extra?.UNSPLASH_API_KEY;



export const searchUnsplash = async ({ searchKeyword, locale = "en-US", base }) => {
    console.log("searchUnsplash call triggered, searchKeyword: ", searchKeyword);

    if (!searchKeyword) {
        console.error("Invalid request. Search keyword is required.");
        return { photos: [], base };
    }

    const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(searchKeyword)}&orientation=landscape&per_page=5`;
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Client-ID ${UNSPLASH_API_KEY}`,  // Unsplash uses Client-ID instead of Bearer token
            },
        });

        if (!response.ok) {
            throw new Error(`Unsplash API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.results);
        return { photos: data.results || [], base };  // `results` is the key for images in Unsplash
    } catch (error) {
        console.error("Error calling Unsplash API:", error);
        return { photos: [], base };
    }
};
