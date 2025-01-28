import { useQueryClient } from '@tanstack/react-query'; 

const useHomeLocation = () => {
    
    const queryClient = useQueryClient();
  

  // Retrieve the formatted location data from the cache
    const homeLocation = queryClient.getQueryData('homeLocation');

    const homeRegion = queryClient.getQueryData('homeRegion');
    

   
  return { 
    homeLocation,
    homeRegion
  };
};

export default useHomeLocation;
