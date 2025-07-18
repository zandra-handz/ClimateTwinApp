import React, { useMemo, useRef } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';  


import { useUser } from '../../src/context/UserContext';
import { getLaunchpadData } from '../../src/calls/apicalls';


const useLaunchpad = () => { 
    const { user } = useUser();
    
    const queryClient = useQueryClient();

    const timeoutRef = useRef(null);


    const { data: launchpad, isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['launchpad'],
        queryFn: () => getLaunchpadData(),
        enabled: !!user && !!user.authenticated,
        onSuccess: (data) => { 
            
        }
    });



    // const createHelloMutation = useMutation({
    //     mutationFn: (data) => saveHello(data),
    //     onError: (error) => {
    //       if (timeoutRef.current) {
    //         clearTimeout(timeoutRef.current);
    //       }
    
    //       timeoutRef.current = setTimeout(() => {
    //         createHelloMutation.reset();
    //       }, 2000);
    //     },
    //     onSuccess: (data) => {
    //       queryClient.setQueryData(["pastHelloes"], (old) => {
    //         const updatedHelloes = old ? [data, ...old] : [data];
    //         return updatedHelloes;
    //       });
    
    //       const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
    //       console.log("Actual HelloesList after mutation:", actualHelloesList);
    
    //       if (timeoutRef.current) {
    //         clearTimeout(timeoutRef.current);
    //       }
    
    //       timeoutRef.current = setTimeout(() => {
    //         createHelloMutation.reset();
    //       }, 2000);
    //     },
    //   });


    //   const handleCreateHello = async (helloData) => {
    //     const hello = {
    //       user: authUserState.user.id,
    //       friend: helloData.friend,
    //       type: helloData.type,
    //       typed_location: helloData.manualLocation,
    //       additional_notes: helloData.notes,
    //       location: helloData.locationId,
    //       date: helloData.date,
    //       thought_capsules_shared: helloData.momentsShared,
    //       delete_all_unshared_capsules: helloData.deleteMoments, // ? true : false,
    //     };
    
    //     console.log("Payload before sending:", hello);
    
    //     try {
    //       await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
    //     } catch (error) {
    //       console.error("Error saving hello:", error);
    //     }
    //   };
  

    return { 
        launchpad, 
};

};



export default useLaunchpad;