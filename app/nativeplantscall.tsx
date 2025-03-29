 
export const API_URL = 'https://api.gbif.org/v1/occurrence/search';
  
    

//?lat=39.3999&lng=-8.2245&radius=200'

 //using GBIF as of 3/28: https://techdocs.gbif.org/en/data-use/

  
 export const getNativePlants = async ({ lat, lon, rad=500 }) => {  //going to use default radius here because no other code should be able to change it anyway
 
     if (!lat || !lon) {
        console.error("Lat, lon, or units missing from getNativePlants api call");
        return null;
    }
 
 
     const url = `${API_URL}?decimalLatitude=${lat}&decimalLongitude=${lon}&radius=${rad}`;
 
     console.log(url);
     try {
         const response = await fetch(url);
       
 
 
         if (!response.ok) {
             throw new Error(`getNativePlants API Error: ${response.status} ${response.statusText}`);
         }
 

         const data = await response.json(); 
         console.log(`getNativePlants api call data: `, data);
       
         return data;
     } catch (error) { 
         return;
     }
 };
 
 