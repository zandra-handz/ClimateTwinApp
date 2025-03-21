import Constants from "expo-constants"; 

export const SMITHSONIAN_API_URL = 'https://api.si.edu/openaccess/api/v1.0/search';
export const SMITHSONIAN_API_KEY = Constants.expoConfig?.extra?.SMITHSONIAN_API_KEY;



export const searchSmithsonian = async ({ searchKeyword, locale = "en-US", base }) => {
    console.log("searchSmithsonian call triggered, searchKeyword: ", searchKeyword);

    if (!searchKeyword) {
        console.error("Invalid request. Search keyword is required.");
        return { photos: [], base };
    }

    const url = `${SMITHSONIAN_API_URL}?q=${encodeURIComponent('birds')}&rows=5&sort=relevancy&row_group=objects&media_type=image&api_key=${SMITHSONIAN_API_KEY}`;

    //const url = `${SMITHSONIAN_API_URL}?q=${encodeURIComponent(searchKeyword)}&rows=5&sort=relevancy&row_group=objects&type=image&api_key=${SMITHSONIAN_API_KEY}&locale=${locale}`;

    try {
        const response = await fetch(url);
        console.log(response.data);

        if (!response.ok) {
            throw new Error(`Smithsonian API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Smithsonian response: `, data.response);
        return { photos: data.response.rows || [], base };  // `results` is the key for images in smithsonian
    } catch (error) {
        console.error("Error calling Smithsonian API:", error);
        return { photos: [], base };
    }
};
