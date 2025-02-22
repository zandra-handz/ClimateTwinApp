import React, { useMemo, useRef } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';  


import { useUser } from '../context/UserContext';
import { getUserSettings, updateUserSettings } from '../apicalls';


const getSettings = () => { 
    const { user, isAuthenticated } = useUser();
    
    const queryClient = useQueryClient();

    const timeoutRef = useRef(null);


    const { data: settings, isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['settings'],
        queryFn: () => getUserSettings(),
        enabled: !!isAuthenticated,
        onSuccess: (data) => { 
            
        }
    });

          const updateAppSettings = async (newSettings) => {
            try {
                await updateAppSettingsMutation.mutateAsync({
                    userId: user?.user.id, // User ID
                    fieldUpdates: newSettings // Pass newSettings directly as fieldUpdates
                });
            } catch (error) {
                console.error('Error updating app settings:', error);
            }
        };
    
        const updateAppSettingsMutation = useMutation({
            mutationFn: (data) => updateUserSettings(data.userId, data.setting),
            onSuccess: (data) => {
                setAppSettings(data); // Assuming the API returns updated settings
                
                queryClient.setQueryData(['settings'], (oldData) => ({
                    ...oldData,
                    settings: data.settings
                }));
            },
            onError: (error) => {
                console.error('Update app settings error:', error);
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
        friends, 
};

};



export default getSettings;