import Constants from "expo-constants"; 

export const SMITHSONIAN_API_URL = 'https://api.si.edu/openaccess/api/v1.0/search';
export const SMITHSONIAN_API_KEY = Constants.expoConfig?.extra?.SMITHSONIAN_API_KEY;

export const searchSmithsonian = async ({ searchKeyword, locale = "en-US", base }) => {
    console.log("searchSmithsonian call triggered, searchKeyword: ", searchKeyword);

    if (!searchKeyword) {
        console.error("Invalid request. Search keyword is required.");
        return { photos: [], base };
    }

    const url = `${SMITHSONIAN_API_URL}?q=${encodeURIComponent(searchKeyword)}&rows=5&sort=relevancy&row_group=objects&media_type=image&api_key=${SMITHSONIAN_API_KEY}`;

    try {
        const response = await fetch(url);
        console.log(`SMITHSONIAN response data: `, response);

        if (!response.ok) {
            throw new Error(`Smithsonian API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Smithsonian response: `, data.response);
        
        // Extracting data from rows and inspecting content field
        const photos = data.response.rows.map(item => {
        
            const content = item.content || {}; // Ensure content is an object
            // Inspecting content structure to extract URLs (if any)
            let imageUrls = [];

            if (content.media) {
                // Look for media or image related fields
                const media = content.media || [];
                imageUrls = media
                    .filter(field => field.type === 'image')  // Look for fields where type is 'image'
                    .map(field => field.url);  // Extract the URL of the image
            }

            // Add any additional content processing logic if necessary
            return {
                title: item.title,
                imageUrls: imageUrls, // Extracted image URLs
            };
        });

        return { photos, base };

    } catch (error) {
        console.error("Error calling Smithsonian API:", error);
        return { photos: [], base };
    }
};
