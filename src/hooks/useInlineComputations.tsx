import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useGlobalStyles } from '../context/GlobalStylesContext';
 
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

        if (!pendingGiftRequests || !otherUserId || !treasureId) { 
          console.log('treasures data missing');
            return null;
        }
 
       
        const treasureIdNum = Number(treasureId);
        const otherUserIdNum = Number(otherUserId);
      
        const recGiftRequestItem = pendingGiftRequests.find((request) => {
          const recId = Number(request.recipient);
          const treasureDataId = Number(request.treasure_data?.id);
    
          return recId === otherUserIdNum && treasureDataId === treasureIdNum;
        });
 
        return recGiftRequestItem || null;

    };

    const otherUserSentGiftRequest = (treasureId, pendingGiftRequests, otherUserId) => {
        if (!pendingGiftRequests || !otherUserId || !treasureId) {
          return null;
        }
       
        const treasureIdNum = Number(treasureId);
        const otherUserIdNum = Number(otherUserId);
      
        const sentGiftRequestItem = pendingGiftRequests.find((request) => {
          const senderId = Number(request.sender);
          const treasureDataId = Number(request.treasure_data?.id);
    
          return senderId === otherUserIdNum && treasureDataId === treasureIdNum;
        });
 
        return sentGiftRequestItem || null;
      };



      // USAGE:
      // const {
      //   portalSurroundings,
      //   ruinsSurroundings,
      //   homeSurroundings,
      //   locationId,
      //   lastAccessed
      // } = getSurroundingsData(currentSurroundings);

      const getSurroundingsData = (currentSurroundings: any) => { 
      
        let portalSurroundings = null;
        let ruinsSurroundings = null;
        let homeSurroundings = null;
        let locationId = null;
        let lastAccessed = null;
      
        if (
          currentSurroundings &&
          currentSurroundings?.last_accessed &&
          !currentSurroundings.is_expired
        ) {
          lastAccessed = currentSurroundings.last_accessed;
          const { twin_location, explore_location } = currentSurroundings;
      
          if (twin_location && twin_location?.id) {
            const { home_location } = twin_location;
      
            portalSurroundings = {
              name: twin_location.name || "N/A",
              id: twin_location.id,
              lastAccessed: twin_location.last_accessed || "",
              temperature: twin_location.temperature || 0,
              description: twin_location.description || "",
              windSpeed: twin_location.wind_speed || 0,
              windDirection: twin_location.wind_direction || 0,
              humidity: twin_location.humidity || 0,
              pressure: twin_location.pressure || 0,
              cloudiness: twin_location.cloudiness || 0,
              sunriseTimestamp: twin_location.sunrise_timestamp || 0,
              sunsetTimestamp: twin_location.sunset_timestamp || 0,
              latitude: twin_location.latitude || 0,
              longitude: twin_location.longitude || 0,
              windFriends: twin_location.wind_friends || "",
              specialHarmony: twin_location.special_harmony || false,
              details: twin_location.details || "",
              experience: twin_location.experience || "",
              windSpeedInteraction: twin_location.wind_speed_interaction || "",
              pressureInteraction: twin_location.pressure_interaction || "",
              humidityInteraction: twin_location.humidity_interaction || "",
              strongerWindInteraction: twin_location.stronger_wind_interaction || "",
              expired: twin_location.expired || false,
            };
      
            homeSurroundings = {
              name: home_location.name || "",
              id: home_location.id || null,
              lastAccessed: home_location.last_accessed || "",
              temperature: home_location.temperature || 0,
              description: home_location.description || "",
              windSpeed: home_location.wind_speed || 0,
              windDirection: home_location.wind_direction || 0,
              humidity: home_location.humidity || 0,
              pressure: home_location.pressure || 0,
              cloudiness: home_location.cloudiness || 0,
              sunriseTimestamp: home_location.sunrise_timestamp || 0,
              sunsetTimestamp: home_location.sunset_timestamp || 0,
              latitude: home_location.latitude || 0,
              longitude: home_location.longitude || 0,
            };
      
            ruinsSurroundings = {
              name: "",
              id: null,
              directionDegree: 0,
              direction: "",
              milesAway: 0,
              latitude: 0,
              longitude: 0,
              tags: {},
              windCompass: "",
              windAgreementScore: 0,
              windHarmony: false,
              streetViewImage: "",
            };
            locationId = twin_location.id;
          } else if (explore_location && explore_location?.id) {
            const { origin_location } = explore_location;
            const { home_location } = origin_location;
      
            portalSurroundings = {
              name: origin_location.name || "N/A",
              id: origin_location.id,
              lastAccessed: origin_location.last_accessed || "",
              temperature: origin_location.temperature || 0,
              description: origin_location.description || "",
              windSpeed: origin_location.wind_speed || 0,
              windDirection: origin_location.wind_direction || 0,
              humidity: origin_location.humidity || 0,
              pressure: origin_location.pressure || 0,
              cloudiness: origin_location.cloudiness || 0,
              sunriseTimestamp: origin_location.sunrise_timestamp || 0,
              sunsetTimestamp: origin_location.sunset_timestamp || 0,
              latitude: origin_location.latitude || 0,
              longitude: origin_location.longitude || 0,
              windFriends: origin_location.wind_friends || "",
              specialHarmony: origin_location.special_harmony || false,
              details: origin_location.details || "",
              experience: origin_location.experience || "",
              windSpeedInteraction: origin_location.wind_speed_interaction || "",
              pressureInteraction: origin_location.pressure_interaction || "",
              humidityInteraction: origin_location.humidity_interaction || "",
              strongerWindInteraction: origin_location.stronger_wind_interaction || "",
              expired: origin_location.expired || false,
            };
      
            homeSurroundings = {
              name: home_location.name || "",
              id: home_location.id || null,
              lastAccessed: home_location.last_accessed || "",
              temperature: home_location.temperature || 0,
              description: home_location.description || "",
              windSpeed: home_location.wind_speed || 0,
              windDirection: home_location.wind_direction || 0,
              humidity: home_location.humidity || 0,
              pressure: home_location.pressure || 0,
              cloudiness: home_location.cloudiness || 0,
              sunriseTimestamp: home_location.sunrise_timestamp || 0,
              sunsetTimestamp: home_location.sunset_timestamp || 0,
              latitude: home_location.latitude || 0,
              longitude: home_location.longitude || 0,
            };
      
            ruinsSurroundings = {
              name: explore_location.name || "",
              id: explore_location.id || 0,
              directionDegree: explore_location.direction_degree || 0,
              direction: explore_location.direction || "",
              milesAway: explore_location.miles_away || 0,
              latitude: explore_location.latitude || 0,
              longitude: explore_location.longitude || 0,
              tags: explore_location.tags || {},
              windCompass: explore_location.wind_compass || "",
              windAgreementScore: explore_location.wind_agreement_score || 0,
              windHarmony: explore_location.wind_harmony || false,
              streetViewImage: explore_location.street_view_image || "",
            };
            locationId = explore_location.id;
          }
        } else {
          portalSurroundings = {
            name: "N/A",
            id: null,
            lastAccessed: "",
            temperature: 0,
            description: "",
            windSpeed: 0,
            windDirection: 0,
            humidity: 0,
            pressure: 0,
            cloudiness: 0,
            sunriseTimestamp: 0,
            sunsetTimestamp: 0,
            latitude: 0,
            longitude: 0,
            windFriends: "",
            specialHarmony: false,
            details: "",
            experience: "",
            windSpeedInteraction: "",
            pressureInteraction: "",
            humidityInteraction: "",
            strongerWindInteraction: "",
            expired: false,
          };
      
          homeSurroundings = {
            name: "",
            id: null,
            lastAccessed: "",
            temperature: 0,
            description: "",
            windSpeed: 0,
            windDirection: 0,
            humidity: 0,
            pressure: 0,
            cloudiness: 0,
            sunriseTimestamp: 0,
            sunsetTimestamp: 0,
            latitude: 0,
            longitude: 0,
          };
      
          ruinsSurroundings = {
            name: "",
            id: null,
            directionDegree: 0,
            direction: "",
            milesAway: 0,
            latitude: 0,
            longitude: 0,
            tags: {},
            windCompass: "",
            windAgreementScore: 0,
            windHarmony: false,
            streetViewImage: "",
          };
          locationId = null;
          lastAccessed = null;
        }
       
      
        return {
          portalSurroundings,
          ruinsSurroundings,
          homeSurroundings,
          locationId,
          lastAccessed,
          getSurroundingsData,
         
        };
      };
      

      const getNearbyLocationsData = (nearbyLocations: any[], lastLocationId: string) => {
          
        let centeredNearbyLocations = [];
        
        if (!lastLocationId || !nearbyLocations || nearbyLocations.length === 0) {
          return centeredNearbyLocations;
        }

        centeredNearbyLocations = nearbyLocations.filter(item => item.id !== lastLocationId);
        return centeredNearbyLocations;
      }



      const getItemChoices = (itemChoicesResponse) => {
        let itemChoices = {};

        if (!itemChoicesResponse) {
          return;
        }

        itemChoices = itemChoicesResponse?.choices
        ? Object.entries(itemChoicesResponse.choices)
        : [];

        return itemChoices;

      }


      const getItemChoicesAsObjectTwin = (itemChoicesResponse) => {

        
        let itemChoicesAsObjectTwin = {};

        if (!itemChoicesResponse) {
          return {};
        }

        // console.log(itemChoicesResponse?.choices);
        itemChoicesAsObjectTwin =
        itemChoicesResponse?.choices &&
        itemChoicesResponse.choices["twin_location"] !== "None"
          ? Object.entries(itemChoicesResponse.choices).reduce(
              (acc, [key, value]) => { 
                acc[key] = value;
                return acc;
              },
              {}
            )
          : {};


          // console.log(`item twin object: `, itemChoicesAsObjectTwin);

        return itemChoicesAsObjectTwin;

      }


      const getItemChoicesAsObjectExplore = (itemChoicesResponse) => {
        let itemChoicesAsObjectExplore = {};

        if (!itemChoicesResponse) {
          return itemChoicesAsObjectExplore;
        }

        itemChoicesAsObjectExplore =
        itemChoicesResponse?.choices &&
        itemChoicesResponse.choices["explore_location"] !== "None"
          ? Object.entries(itemChoicesResponse.choices).reduce(
              (acc, [key, value]) => { 
                acc[key] = value;
                return acc;
              },
              {}
            )
          : {};

        return itemChoicesAsObjectExplore;

      }



      const getStrippedItemChoicesAsObjectTwin = (itemChoicesResponse) => {
        let strippedItemChoicesAsObjectTwin = {};


        if (!itemChoicesResponse) {
          return strippedItemChoicesAsObjectTwin;
        }

        strippedItemChoicesAsObjectTwin =
        itemChoicesResponse?.choices &&
        itemChoicesResponse.choices["twin_location"] !== "None"
          ? Object.entries(itemChoicesResponse.choices).reduce(
              (acc, [key, value]) => {
                // strip for simplicity
                const newKey = key.startsWith("twin_location__")
                  ? key.replace("twin_location__", "")
                  : key;
    
                acc[newKey] = value;
                return acc;
              },
              {}
            )
          : {};

        return strippedItemChoicesAsObjectTwin;

      }


      const getStrippedItemChoicesAsObjectExplore = (itemChoicesResponse) => {
        let strippedItemChoicesAsObjectExplore = {};

        if (!itemChoicesResponse) {
          return strippedItemChoicesAsObjectExplore;
        }

        strippedItemChoicesAsObjectExplore =
        itemChoicesResponse?.choices &&
        itemChoicesResponse.choices["explore_location"] !== "None"
          ? Object.entries(itemChoicesResponse.choices).reduce(
              (acc, [key, value]) => {
                const newKey = key.startsWith("explore_location__")
                  ? key.replace("explore_location__", "")
                  : key;
    
                acc[newKey] = value;
                return acc;
              },
              {}
            )
          : {};

        return strippedItemChoicesAsObjectExplore;

      }
      

const getWikiLink = (endpointData, reAdjustedIndex) => {
  let wikiLink = null;

  if (!endpointData || !endpointData?.results) {
    return wikiLink;
  }
  wikiLink = endpointData?.results[reAdjustedIndex]?.taxon?.wikipedia_url
  ? endpointData.results[reAdjustedIndex].taxon.wikipedia_url.replace(/^http:/, "https:")
  : null;

  return wikiLink;
}


const getiNaturalistItemData = (endpointData, index) => {
  let resultsExist = false;
  let label = null;
  let scientificLabel = null;
  let mediumImageUrl = null;
  let imageUrl = null;



  if (!endpointData || !endpointData?.results || !endpointData?.results[index] ) {
    return { resultsExist, label, scientificLabel, mediumImageUrl, imageUrl };
  } 
  resultsExist = true;
  label = endpointData?.results[index]?.taxon?.preferred_common_name || "No common name available";
  scientificLabel  = endpointData?.results[index]?.taxon?.name || "No name available";
  mediumImageUrl = endpointData?.results[index]?.taxon?.default_photo?.medium_url || null;
  imageUrl = endpointData?.results[index]?.taxon?.default_photo?.url || null;


  return {  resultsExist, label, scientificLabel, mediumImageUrl, imageUrl };
}

const getNonPendingTreasures = (treasures) => {
  let nonPendingTreasures = [];

  if (!treasures) {
    return nonPendingTreasures;
  }

  nonPendingTreasures = treasures.filter((treasure) => (treasure.pending === false));

  return nonPendingTreasures;

};
 


    return {
        sortPendingFriendRequests,
        
        checkForExistingFriendship,
        otherUserRecFriendRequest,
        otherUserSentFriendRequest,


        getNonPendingTreasures,
        sortPendingGiftRequests,
        checkForTreasureOwnership,
        otherUserRecGiftRequest,
        otherUserSentGiftRequest,

        getSurroundingsData,

        getNearbyLocationsData,

        getItemChoices,
        getItemChoicesAsObjectTwin,
        getItemChoicesAsObjectExplore,
        getStrippedItemChoicesAsObjectTwin,
        getStrippedItemChoicesAsObjectExplore,


        // iNaturalist
        getWikiLink,
        getiNaturalistItemData, 


   

    }
}

export default useInlineComputations;