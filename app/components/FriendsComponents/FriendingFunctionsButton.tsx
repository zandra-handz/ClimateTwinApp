import React, {   useState } from "react";
import { View, Text, TouchableOpacity  } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
 
import { useFriends } from "@/src/context/FriendsContext";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useAppMessage } from "@/src/context/AppMessageContext";
 
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import { useUser } from "@/src/context/UserContext";
 
import useInlineComputations from "@/src/hooks/useInlineComputations";

import DoubleCheckerWithMessageInput from "../Scaffolding/DoubleCheckerWithMessageInput";


//sort sent and rec higher and pass in to this
const FriendingFunctionsButton = ({ cTUserId, cTUsername, size, recFriendRequests, sentFriendRequests }) => {
  const router = useRouter();
  const { user } = useUser();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
    const [ isDoubleCheckerVisible, setDoubleCheckerVisible ] = useState(false);
  // const [isFriend, setIsFriend] = useState<boolean>(false); 
  const { showAppMessage } = useAppMessage();
  const {
    friends, 
    handleSendFriendRequest,
    handleAcceptFriendship,
    acceptFriendshipMutation,
    handleDeclineFriendship,
    declineFriendshipMutation,
  } = useFriends();


  // const { pendingRequests } = usePendingRequests();
  const { sortPendingFriendRequests, checkForExistingFriendship, otherUserRecFriendRequest, otherUserSentFriendRequest } = useInlineComputations();
 
// const allFriendRequests = pendingRequests?.pending_friend_requests;
  // const { recFriendRequests, sentFriendRequests } = sortPendingFriendRequests(allFriendRequests, user?.id);
 
 
const isFriend = checkForExistingFriendship(friends, cTUserId);
//  console.log(`FRIEND REQS`, sentFriendRequests, cTUserId);
//  console.log(isFriend);
  const recFriendRequest = otherUserRecFriendRequest(isFriend, sentFriendRequests, cTUserId);

  const sentFriendRequestItem = otherUserSentFriendRequest(isFriend, recFriendRequests, cTUserId);
  const messageId = sentFriendRequestItem?.id || null;

 const sentFriendRequest = !!sentFriendRequestItem;
//  console.log(sentFriendRequest);
//  console.log(recFriendRequest);
  const { triggerRequestsAndInboxRefetch } = usePendingRequests();

  const handleToggleDoubleChecker = () => {  
    setDoubleCheckerVisible(prev => !prev);
  
  };  
 
  const handleAddFriend = (message) => {  
    if (cTUserId) {
      const numberId = Number(cTUserId);
      
    handleSendFriendRequest(numberId, message);
    handleToggleDoubleChecker(); 
    
  }
  
   };

  const handleAccept = () => {
    if (messageId) {
      handleAcceptFriendship(messageId);
      //triggerRequestsAndInboxRefetch(); doing this in the Friend context
    }
  };

  const handleDecline = () => {
    if (messageId) {
      handleDeclineFriendship(messageId);
     // triggerRequestsAndInboxRefetch(); doing this in the Friend context
    }
  };


 

  return (
    <> 
    {isDoubleCheckerVisible && (
      <DoubleCheckerWithMessageInput
      isVisible={isDoubleCheckerVisible}
      toggleVisible={handleToggleDoubleChecker}
      singleQuestionText={`Add ${cTUsername || ''}?`}
 
      noButtonText="Back"
      yesButtonText="Send"
      onPress={handleAddFriend} />
    )}
    <View
      style={{
        flex: 1,
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      {!isFriend && sentFriendRequest && (
        <View
          style={{
            borderRadius: 10,
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "space-evenly",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
           // backgroundColor: "orange",
          }}
        >
          <TouchableOpacity
            onPress={handleAccept}
            style={{
              borderRadius: 6,
              width: "90%",
              height: "40%",
              alignItems: "center",
              justifyContent: 'center',
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          >
            <Text style={themeStyles.primaryText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDecline}
            style={{
              borderRadius: 6,
              width: "90%",
              height: "40%",
              alignItems: "center",
              justifyContent: 'center',
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          >
            <Text style={themeStyles.primaryText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isFriend && !sentFriendRequest && !recFriendRequest && (
        <TouchableOpacity
          onPress={handleToggleDoubleChecker}
          style={{
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "center",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
          //  backgroundColor: "orange",
          }}
        >
          <Feather
            name="user-plus"
            size={size / 2}
            color={themeStyles.primaryText.color}
            style={{
              borderRadius: size / 2,
              opacity: 0.9,
              backgroundColor: "transparent",
              marginRight: 4,
            }}
          />
          {/* <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.friendingFunctionsButtonText,
              ]}
            >
              Add
            </Text> */}
        </TouchableOpacity>
      )}
      {!isFriend && recFriendRequest && (
        <View
        style={{
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "center",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
          //  backgroundColor: "orange",
          }}
        >
          <Text style={[themeStyles.primaryText]}>Request sent</Text>
        </View>
      )}

      {isFriend && (
        <View
          style={{
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "center",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
          //  backgroundColor: "orange",
          }}
        >
          <AntDesign
            name="check"
            size={size / 2}
            color={`limegreen`}
            style={{
              borderRadius: size / 2,
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          />
        </View>
      )}
    </View>
    </>
  );
};

export default FriendingFunctionsButton;
