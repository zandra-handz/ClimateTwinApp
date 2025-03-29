
 
export const API_URL = 'https://api.inaturalist.org/v1/observations';
 

  
 export const getINaturalist = async ({ lat, lon, rad=50 }) => {  //going to use default radius here because no other code should be able to change it anyway
 
     if (!lat || !lon) {
        console.error("Lat, lon, or units missing from getNativePlants api call");
        return null;
    }
 
  
     const url = `${API_URL}?lat=${lat}&lng=${lon}&radius=${rad}&per_page=8`;
     console.log(url);
     try {
         const response = await fetch(url);
       
 
 
         if (!response.ok) {
             throw new Error(`getINaturalist API Error: ${response.status} ${response.statusText}`);
         }
 

         const data = await response.json(); 
         //console.log(`getINaturalist api call data: `, data);
       
         return data;
     } catch (error) { 
         return;
     }
 };
 
 