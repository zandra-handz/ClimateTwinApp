// import React, { useState, useEffect, useRef } from 'react';
// import { fetchFriendImagesByCategory, createFriendImage, updateFriendImage, deleteFriendImage } from '../api'; // Adjust the import path as needed
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
//  import { useAppMessage } from '../context/AppMessageContext';


// const useImageFunctions = () => { 
//     const queryClient = useQueryClient(); 
//     const { showMessage } = useMessage();

//     const { data: imageList = [], isLoading: isImageContextLoading } = useQuery({
//         queryKey: ['friendImages', selectedFriend?.id],
//         queryFn: () => fetchFriendImagesByCategory(selectedFriend.id),
//         enabled: !!selectedFriend, // Only run query if selectedFriend is available
//         select: (imagesData) => {
//             // Flattening the images
//             const flattenedImages = [];
//             Object.keys(imagesData).forEach(category => {
//                 imagesData[category].forEach(image => {
//                     let imagePath = image.image;
//                     if (imagePath.startsWith('/media/')) {
//                         imagePath = imagePath.substring(7);
//                     }
//                     flattenedImages.push({
//                         ...image,
//                         image: imagePath,
//                         image_category: category,
//                     });
//                 });
//             });
//             return flattenedImages;
//         },
//     });
 
//     const imageCount = imageList.length;

//     const timeoutRef = useRef(null);
    
//     const updateImageMutation = useMutation({
//         mutationFn: (imageData) => updateFriendImage(selectedFriend.id, imageData.id, imageData.updatedData), // Pass friendId and imageId
//         onSuccess: () => {
//             queryClient.invalidateQueries(['friendImages', selectedFriend?.id]);
        
//         },
//         onError: (error) => {
//             console.error('Error updating image:', error);
//         },
//     });

//     const updateImage = (id, updatedData) => {
//         updateImageMutation.mutate({ id, updatedData });
//     };
 
//     const deleteImageMutation = useMutation({
//         mutationFn: (id) => deleteFriendImage(selectedFriend.id, id), // Pass friendId and imageId
//         onSuccess: () => { 

//             showMessage(true, null, 'Image deleted!');
//             queryClient.invalidateQueries(['friendImages', selectedFriend?.id]);
 
//             if (timeoutRef.current) {
//                 clearTimeout(timeoutRef.current);
//               }

 
//             timeoutRef.current = setTimeout(() => {
//                 deleteImageMutation.reset(); 
//               }, 2000);

//         },
//         onError: (error) => {
//             if (timeoutRef.current) {
//                 clearTimeout(timeoutRef.current);
//               }


//             console.error('Error deleting image:', error);
//             showMessage(true, null, 'Oops! Image not deleted');
//             timeoutRef.current = setTimeout(() => {
//                 deleteImageMutation.reset(); 
//               }, 2000);
//         },
//     });

//     const deleteImage = (id) => { 
//         deleteImageMutation.mutate(id);
//     };


//     const createImageMutation = useMutation({
//         mutationFn: (formData) => createFriendImage(selectedFriend.id, formData), // Use the imported function
//         onSuccess: () => {
//             showMessage(true, null, 'Image uploaded!');
//             queryClient.invalidateQueries(['friendImages', selectedFriend?.id]);
//             if (timeoutRef.current) {
//                 clearTimeout(timeoutRef.current);
//               }

 
//             timeoutRef.current = setTimeout(() => {
//                 createImageMutation.reset(); 
//               }, 2000);
//         },
//         onError: (error) => { 
//             if (timeoutRef.current) {
//                 clearTimeout(timeoutRef.current);
//               }

//               showMessage(true, null, 'Oops! Error uploading image');
//             console.error('Error uploading image:', error);
//             timeoutRef.current = setTimeout(() => {
//                 createImageMutation.reset(); 
//               }, 2000);
//         },
//     });

//     const createImage = (formData) => {
        
//         createImageMutation.mutate(formData);
//     };

//     return { imageList, imageCount, isImageContextLoading, updateImage, deleteImage, deleteImageMutation, createImage, createImageMutation };

// }


// export default useImageFunctions;