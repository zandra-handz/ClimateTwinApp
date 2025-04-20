import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import useFriends from "@/app/hooks/useFriends";
import Avatar from "../FriendsComponents/Avatar";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import AddFriendButton from "../Scaffolding/AddFriendButton";
import UnfriendButton from "../Scaffolding/UnfriendButton";

const UserListItem = ({user, avatar, size, onPress, showIsFriend=false}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
const [ isFriend, setIsFriend ] = useState<boolean>(false);
const { friends } = useFriends();

 

useEffect(() => {
    if (friends && showIsFriend) {
        const checkForFriendship = friends?.find((friend) => (friend.friend === user.id));
 
        setIsFriend(!!checkForFriendship);

    }

}, [friends, showIsFriend]);

  return ( 
      <TouchableOpacity
        style={[
          appContainerStyles.pickerButtonContainer,
          themeStyles.darkerBackground,
          { borderColor: themeStyles.primaryText.color,
            height: size * 1.8
           },
        ]}
        onPress={() => onPress(user)}
      >
        <View style={{ paddingRight: size / 3 }}>
          <Avatar image={avatar} size={size} />
        </View>

        <Text style={[themeStyles.primaryText, appFontStyles.dCButtonText]}>
          {user.username}
        </Text>
        {isFriend && showIsFriend && (
          <AntDesign
          name="check"
          size={size / 2}
          color={`limegreen`}
          style={{position: 'absolute', right: 10, padding: 6, borderRadius: size / 2, backgroundColor: themeStyles.darkerBackground.backgroundColor}}
            />
        )
          } 
                  {!isFriend && showIsFriend && (
          <AddFriendButton isAlreadyFriend={isFriend}   />
        )
          } 
      </TouchableOpacity> 
  );
};

export default UserListItem;
