import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useGlobalStyles } from '../../src/context/GlobalStylesContext';

// To help me with the process of refactoring useEffects to computations at thte tops of components instead 
// :)
const useInlineComputations = () => {

    const sortPendingFriendRequests = (pendingFriendRequests, userId) => { //pendingRequests.pending_friend_requests
         
        if (!pendingFriendRequests || pendingFriendRequests.length === 0 || !userId) {
            console.log('SOMETHING MISSING IN SORTPENDING')
          return { recFriendRequests: [], sentFriendRequests: [] };
        }
    
        const recFriendRequests = pendingFriendRequests.filter(
          (request) => request.recipient === userId
        );
 
        const sentFriendRequests = pendingFriendRequests.filter(
          (request) => request.sender === userId
        );
    
        return { recFriendRequests, sentFriendRequests };
      };



    const sortPendingGiftRequests = (pendingGiftRequests, otherUserId) => {
        if (!pendingGiftRequests || pendingGiftRequests.length === 0 || !otherUserId) {
            return { recGiftRequests: [], sentGiftRequests: []};
        };
        const recGiftRequests = pendingGiftRequests.filter(
            (request) => request.recipient === otherUserId

        );
        const sentGiftRequests = pendingGiftRequests.filter(
            (request) => request.sender === otherUserId
        );


        return { recGiftRequests, sentGiftRequests };
    };


    const checkForExistingFriendship = (userFriendsArray, otherUserId) => {
        if (!userFriendsArray || !otherUserId) {
          console.log("Missing input in checkForExistingFriendship");
          return false;
        }
  
        const isFriend = userFriendsArray.find((userFriend) => { 
          return userFriend.friend === otherUserId;
        });
       
        return !!isFriend;
      };


    const checkForTreasureOwnership = (treasureId, userTreasuresArray, otherUserId) => {
        if (!userTreasuresArray || !otherUserId) {
            return false;
        }

        const isOwner = userTreasuresArray.find((userTreasure) => {
            return userTreasure.id === treasureId && userTreasure.user === otherUserId;
        });

        return !!isOwner;
    }

    const otherUserRecFriendRequest = (isAlreadyFriend, pendingFriendRequests, otherUserId) => {
        if (!pendingFriendRequests || !otherUserId) {
            console.log('missing input in otherUserRecFriendRequest');
            return false;
        } 
 

        if (isAlreadyFriend) {
            return false;
        }

        const recFriendRequest = pendingFriendRequests.find(
            (request) => request.recipient === otherUserId
        ); 

        return !!recFriendRequest;

    };

    const otherUserSentFriendRequest = (isAlreadyFriend, pendingFriendRequests, otherUserId) => {
        

        if (!pendingFriendRequests || !otherUserId) {
            console.log('missing input in otherUserSentFriendRequest');
            return null;
        }

        if (isAlreadyFriend) {
            return null;
        }

        const sentFriendRequestItem = pendingFriendRequests.find(
            (request) => request.sender === otherUserId
        );

        return sentFriendRequestItem;


    };

    const otherUserRecGiftRequest = ( treasureId, pendingGiftRequests, otherUserId) => {

        if (!pendingGiftRequests || !otherUserId) { 
            return null;
        }
 
        const recGiftRequest = pendingGiftRequests.find(
            (request) => request.recipient === otherUserId && request.treasure_data.id === treasureId
        );

        return !!recGiftRequest;

    };

    const otherUserSentGiftRequest = (treasureId, pendingGiftRequests, otherUserId) => {
        if (!pendingGiftRequests || !otherUserId || !treasureId) {
          console.log('data missing');
          return null;
        }
      
        // console.log('treasure id:', treasureId);
      
        const treasureIdNum = Number(treasureId);
        const otherUserIdNum = Number(otherUserId);
      
        const sentGiftRequestItem = pendingGiftRequests.find((request) => {
          const senderId = Number(request.sender);
          const treasureDataId = Number(request.treasure_data?.id);
      
        //   console.log('checking request:', {
        //     senderId,
        //     treasureDataId,
        //     matchSender: senderId === otherUserIdNum,
        //     matchTreasure: treasureDataId === treasureIdNum,
        //   });
      
          return senderId === otherUserIdNum && treasureDataId === treasureIdNum;
        });
      
        // console.log('sentGift', sentGiftRequestItem);
        return sentGiftRequestItem;
      };
      
    
    // const otherUserSentGiftRequest = ( treasureId, pendingGiftRequests, otherUserId) => {

    //     if (!pendingGiftRequests || !otherUserId || !treasureId) { 
    //         console.log('data missing');
    //         return null;
    //     }


    //     console.log('treasure id: ', treasureId);
 
    //     const sentGiftRequestItem = pendingGiftRequests.find(
    //         (request) => request.sender === otherUserId && request.treasure_data.id === treasureId
    //     );
    //     console.log(`sentGift`, sentGiftRequestItem);

    //     return sentGiftRequestItem;

    // };



    // useEffect(() => { 
  
    //     if (giftRequests && giftRequests.length > 0 && user) {
    //       const received = giftRequests?.filter(
    //         (request) => request.recipient === user?.id
    //       );
    //       const sent = giftRequests?.filter(
    //         (request) => request.sender === user?.id
    //       ); 
    
    //       setGiftRequestsReceived(received);
    //       setGiftRequestsSent(sent);
    //     }
    //   }, [giftRequests, user]);



    return {
        sortPendingFriendRequests,
        
        checkForExistingFriendship,
        otherUserRecFriendRequest,
        otherUserSentFriendRequest,
        sortPendingGiftRequests,
        checkForTreasureOwnership,
        otherUserRecGiftRequest,
        otherUserSentGiftRequest,

    }
}

export default useInlineComputations;